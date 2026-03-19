/**
 * templateManagerIPC.js
 *
 * Pega este contenido dentro de setupIpcHandlers() en main.js
 * Integra el TemplateManager al pipeline de creación de LiteCode
 */

'use strict';

const path            = require('path');
const TemplateManager = require('./src/vs/workbench/services/templateManager');

let templateManager = null;

function registerTemplateManagerIPC(ipcMain, mainWindow, store) {

    // Inicializar TemplateManager
    templateManager = new TemplateManager({
        // Tu repo de templates en GitHub
        repoUrl:  store.get('templateRepoUrl') || 'https://github.com/alfonsotipan1312/litecode-templates',
        cacheDir: path.join(require('electron').app.getPath('userData'), 'template-cache'),
        onEvent: (event, data) => {
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('template-event', { event, data });
            }
        },
    });

    // ── Detectar template desde prompt ───────────────────────────────────────
    ipcMain.handle('template-detect', async (_, prompt) => {
        const template = templateManager.detectTemplate(prompt);
        return template;
    });

    // ── Clonar template al directorio del proyecto ────────────────────────────
    ipcMain.handle('template-clone', async (_, { templateId, destPath, projectName }) => {
        try {
            const result = await templateManager.cloneTemplate(templateId, destPath, projectName);
            return { success: true, ...result };
        } catch (err) {
            return { success: false, error: err.message };
        }
    });

    // ── Obtener lista de templates disponibles ────────────────────────────────
    ipcMain.handle('template-list', async () => {
        try {
            const fs   = require('fs');
            const file = path.join(__dirname, 'src', 'vs', 'workbench', 'services', 'litecode-templates', 'templates.json');
            if (fs.existsSync(file)) {
                return { success: true, templates: JSON.parse(fs.readFileSync(file, 'utf8')).templates };
            }
            return { success: true, templates: [] };
        } catch (err) {
            return { success: false, error: err.message };
        }
    });

    // ── Configurar repo URL ───────────────────────────────────────────────────
    ipcMain.handle('template-set-repo', async (_, repoUrl) => {
        store.set('templateRepoUrl', repoUrl);
        templateManager.repoUrl = repoUrl;
        return { success: true };
    });

    console.log('[Templates] ✅ Template Manager IPC handlers registered');
}

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION: ai-send-prompt-with-tools handler
// Agrega esto AL INICIO del handler, antes del loop de iteraciones
// ─────────────────────────────────────────────────────────────────────────────

async function tryTemplateFirst(options, templateManager, mainWindow) {
    // Solo si es una petición de CREACIÓN de proyecto nuevo
    const isCreationRequest = /\b(crea|crear|genera|generar|construye|construir|haz|hacer|inicializa|new project|nuevo proyecto)\b/i.test(options.prompt || '');

    if (!isCreationRequest || !options.cwd) return null;

    // Verificar que el directorio está vacío (es un proyecto nuevo)
    const fs = require('fs');
    try {
        const entries = fs.readdirSync(options.cwd).filter(f => !f.startsWith('.'));
        if (entries.length > 0) return null; // directorio no vacío — no clonar
    } catch {
        return null;
    }

    // Detectar template
    const template = templateManager.detectTemplate(options.prompt);
    if (!template || template.score < 2) return null;

    // Notificar al frontend
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ai-tool-executing', {
            name: 'clone_template',
            args: { templateId: template.id, name: template.name },
        });
    }

    // Clonar template
    const projectName = extractProjectName(options.prompt);
    await templateManager.cloneTemplate(template.id, options.cwd, projectName);

    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ai-tool-result', {
            name:   'clone_template',
            args:   { templateId: template.id },
            result: { success: true, message: `Template "${template.name}" clonado. Ahora el AI adaptará el proyecto.` },
        });
    }

    // Retornar contexto para el AI — ahora modifica en vez de crear desde cero
    return {
        templateUsed: template,
        modificationPrompt: `
El proyecto base ya fue clonado usando el template "${template.name}".
La estructura del proyecto ya existe en ${options.cwd}.

Tu trabajo ahora es MODIFICAR el template existente para adaptarlo a lo que pidió el usuario:
"${options.prompt}"

REGLAS IMPORTANTES:
1. NO crear archivos que ya existen a menos que necesiten cambios
2. NO cambiar tsconfig.json, vite.config.ts, ni package.json a menos que sea estrictamente necesario
3. SÍ modificar: páginas, componentes, estilos, rutas, servicios API
4. SÍ añadir nuevas páginas y componentes según el requerimiento
5. El archivo src/App.tsx/jsx ya tiene el router — solo añadir nuevas rutas

Adapta el proyecto al requerimiento del usuario manteniendo la estructura base.
        `.trim(),
    };
}

function extractProjectName(prompt) {
    const patterns = [
        /(?:llama(?:do)?|llamada|nombre[sd]?o?|called?)\s+["']?([a-zA-Z0-9\s-_]+)["']?/i,
        /(?:para|for)\s+(?:un[a]?\s+)?["']?([a-zA-Z0-9\s-_]{3,30})["']?/i,
    ];
    for (const p of patterns) {
        const m = prompt.match(p);
        if (m) return m[1].trim().slice(0, 30);
    }
    return 'mi-proyecto';
}

module.exports = { registerTemplateManagerIPC, tryTemplateFirst };
