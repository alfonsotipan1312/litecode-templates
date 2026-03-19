/**
 * templateManager.js
 * 
 * Clona un template desde el repo de LiteCode Templates,
 * lo adapta al proyecto del usuario y lo entrega listo para modificar.
 */

'use strict';

const { execSync, exec } = require('child_process');
const path   = require('path');
const fs     = require('fs');
const os     = require('os');

// ── Template registry ─────────────────────────────────────────────────────────

const TEMPLATES = [
    {
        id:       'react-ts-vite',
        name:     'React + TypeScript + Vite',
        tags:     ['react','typescript','ts','vite','spa','frontend','tsx'],
        port:     5173,
        runCmd:   'npm install && npm run dev',
        features: ['auth-jwt','react-router','axios','tailwind'],
        language: 'typescript',
        framework:'react',
    },
    {
        id:       'react-js-vite',
        name:     'React + JavaScript + Vite',
        tags:     ['react','javascript','js','vite','spa','frontend','jsx'],
        port:     5173,
        runCmd:   'npm install && npm run dev',
        features: ['auth-jwt','react-router','axios'],
        language: 'javascript',
        framework:'react',
    },
    {
        id:       'dotnet-webapi',
        name:     '.NET 8 WebAPI',
        tags:     ['dotnet','.net','csharp','c#','webapi','api','backend'],
        port:     5000,
        runCmd:   'dotnet restore && dotnet run',
        features: ['auth-jwt','entity-framework','swagger','cors'],
        language: 'csharp',
        framework:'dotnet',
    },
    {
        id:       'express-node',
        name:     'Express + Node.js',
        tags:     ['express','node','nodejs','api','backend','javascript','rest'],
        port:     3001,
        runCmd:   'npm install && npm run dev',
        features: ['auth-jwt','prisma','cors','helmet'],
        language: 'javascript',
        framework:'express',
    },
];

// ── Main class ────────────────────────────────────────────────────────────────

class TemplateManager {
    /**
     * @param {object} opts
     * @param {string} opts.repoUrl    — GitHub repo URL
     * @param {string} opts.cacheDir  — local cache directory
     * @param {Function} opts.onEvent — event emitter
     */
    constructor(opts = {}) {
        this.repoUrl  = opts.repoUrl  || 'https://github.com/alfonsotipan1312/litecode-templates';
        this.cacheDir = opts.cacheDir || path.join(os.homedir(), '.litecode', 'template-cache');
        this.onEvent  = opts.onEvent  || (() => {});
        fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    // ── Detect which template to use ──────────────────────────────────────────

    detectTemplate(prompt) {
        const p = prompt.toLowerCase();

        // Score each template
        const scored = TEMPLATES.map(t => {
            let score = 0;
            for (const tag of t.tags) {
                if (p.includes(tag)) score += tag.length > 4 ? 3 : 1;
            }
            return { ...t, score };
        }).sort((a, b) => b.score - a.score);

        const best = scored[0];

        this.emit('template_detected', {
            templateId: best.id,
            name:       best.name,
            score:      best.score,
            prompt:     prompt.slice(0, 80),
        });

        return best;
    }

    // ── Clone template to project directory ───────────────────────────────────

    async cloneTemplate(templateId, destPath, projectName) {
        const template = TEMPLATES.find(t => t.id === templateId);
        if (!template) throw new Error(`Template "${templateId}" not found`);

        this.emit('clone_start', { templateId, destPath });

        // Check if we have a cached version
        const cachePath = path.join(this.cacheDir, templateId);
        const cacheAge  = this._getCacheAge(cachePath);

        if (cacheAge < 24 * 60 * 60 * 1000) {
            // Cache is fresh (less than 24h) — use it
            this.emit('using_cache', { templateId, age: Math.round(cacheAge / 60000) + 'min' });
            fs.cpSync(cachePath, destPath, { recursive: true });
        } else {
            // Clone fresh from GitHub
            this.emit('cloning_github', { repoUrl: this.repoUrl, templateId });
            await this._cloneFromGitHub(templateId, cachePath, destPath);
        }

        // Personalize the template
        await this.personalizeTemplate(destPath, { projectName, template });

        this.emit('clone_done', { templateId, destPath, projectName });
        return { template, destPath };
    }

    async _cloneFromGitHub(templateId, cachePath, destPath) {
        // Remove stale cache
        if (fs.existsSync(cachePath)) fs.rmSync(cachePath, { recursive: true });
        fs.mkdirSync(cachePath, { recursive: true });

        try {
            // Sparse clone — only the template subfolder
            execSync(
                `git clone --depth 1 --filter=blob:none --sparse "${this.repoUrl}" "${cachePath}"`,
                { timeout: 60000, stdio: 'pipe' }
            );
            execSync(
                `git sparse-checkout set ${templateId}`,
                { cwd: cachePath, timeout: 30000, stdio: 'pipe' }
            );

            // Move template content to cache root
            const templateSubDir = path.join(cachePath, templateId);
            if (fs.existsSync(templateSubDir)) {
                const tmpPath = cachePath + '_tmp';
                fs.cpSync(templateSubDir, tmpPath, { recursive: true });
                fs.rmSync(cachePath, { recursive: true });
                fs.renameSync(tmpPath, cachePath);
            }

            // Copy cache to destination
            fs.cpSync(cachePath, destPath, { recursive: true });

        } catch (err) {
            this.emit('clone_fallback', { error: err.message });
            // Fallback: generate minimal template
            await this._generateFallbackTemplate(templateId, destPath);
        }
    }

    _getCacheAge(cachePath) {
        try {
            const stat = fs.statSync(cachePath);
            return Date.now() - stat.mtimeMs;
        } catch {
            return Infinity;
        }
    }

    // ── Personalize cloned template ───────────────────────────────────────────

    async personalizeTemplate(destPath, { projectName, template }) {
        this.emit('personalizing', { projectName });

        const safeName  = (projectName || 'mi-proyecto')
            .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const titleName = projectName || 'Mi Proyecto';

        // Walk all files and replace placeholders
        this._walkDir(destPath, (filePath) => {
            const ext = path.extname(filePath);
            const textExts = [
                '.ts','.tsx','.js','.jsx','.json','.html',
                '.css','.scss','.md','.env','.gitignore',
                '.csproj','.cs','.py','.toml','.yaml','.yml',
            ];
            if (!textExts.includes(ext)) return;

            try {
                let content = fs.readFileSync(filePath, 'utf8');
                content = content
                    .replace(/\{\{PROJECT_NAME\}\}/g,  safeName)
                    .replace(/\{\{PROJECT_TITLE\}\}/g, titleName)
                    .replace(/\{\{PROJECT_CLASS\}\}/g, this._toPascalCase(safeName));
                fs.writeFileSync(filePath, content, 'utf8');
            } catch {}
        });

        // Update package.json name
        const pkgPath = path.join(destPath, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                pkg.name  = safeName;
                fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
            } catch {}
        }

        // Remove .git from cloned template
        const gitDir = path.join(destPath, '.git');
        if (fs.existsSync(gitDir)) fs.rmSync(gitDir, { recursive: true });
    }

    // ── Fallback template generation (when GitHub is unavailable) ─────────────

    async _generateFallbackTemplate(templateId, destPath) {
        this.emit('generating_fallback', { templateId });
        fs.mkdirSync(destPath, { recursive: true });

        const generators = {
            'react-ts-vite':  () => this._genReactTS(destPath),
            'react-js-vite':  () => this._genReactJS(destPath),
            'dotnet-webapi':  () => this._genDotNet(destPath),
            'express-node':   () => this._genExpress(destPath),
        };

        await generators[templateId]?.();
    }

    // ── React TS fallback ──────────────────────────────────────────────────────

    _genReactTS(dest) {
        this._writeFiles(dest, {
            'package.json': JSON.stringify({
                name: "{{PROJECT_NAME}}", private: true, version: "0.1.0", type: "module",
                scripts: { dev: "vite", build: "tsc && vite build", preview: "vite preview" },
                dependencies: {
                    react: "^18.2.0", "react-dom": "^18.2.0",
                    "react-router-dom": "^6.18.0", axios: "^1.5.0",
                },
                devDependencies: {
                    "@types/react": "^18.2.15", "@types/react-dom": "^18.2.7",
                    "@vitejs/plugin-react": "^4.0.3",
                    typescript: "^5.0.2", vite: "^4.4.5",
                },
            }, null, 2),

            'tsconfig.json': JSON.stringify({
                compilerOptions: {
                    target: "ES2020", lib: ["ES2020","DOM","DOM.Iterable"],
                    module: "ESNext", skipLibCheck: true,
                    moduleResolution: "bundler", allowImportingTsExtensions: true,
                    resolveJsonModule: true, isolatedModules: true,
                    noEmit: true, jsx: "react-jsx", strict: true,
                },
                include: ["src"],
            }, null, 2),

            'vite.config.ts': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
})`,

            'index.html': `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{PROJECT_TITLE}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

            'src/main.tsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)`,

            'src/App.tsx': `import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}`,

            'src/types/index.ts': `export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  token?: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface LoginRequest {
  email: string
  password: string
}`,

            'src/services/api.ts': `import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = \`Bearer \${token}\`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api`,

            'src/context/AuthContext.tsx': `import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest } from '../types'
import api from '../services/api'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get<User>('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (data: LoginRequest) => {
    const res = await api.post<User>('/auth/login', data)
    localStorage.setItem('token', res.data.token || '')
    setUser(res.data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}`,

            'src/components/ProtectedRoute.tsx': `import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Cargando...</div>
  if (!user)   return <Navigate to="/login" replace />
  return <Outlet />
}`,

            'src/pages/LoginPage.tsx': `import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch {
      setError('Credenciales inválidas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{{PROJECT_TITLE}}</h1>
          <p>Inicia sesión para continuar</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email" type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password" type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}`,

            'src/pages/DashboardPage.tsx': `import { useAuth } from '../context/AuthContext'
import '../styles/DashboardPage.css'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{{PROJECT_TITLE}}</h1>
        <div className="header-user">
          <span>Hola, {user?.name || user?.email}</span>
          <button onClick={logout} className="logout-btn">Cerrar sesión</button>
        </div>
      </header>
      <main className="dashboard-main">
        <h2>Dashboard</h2>
        <p>Bienvenido al sistema. Aquí irá el contenido principal.</p>
      </main>
    </div>
  )
}`,

            'src/styles/global.css': `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', system-ui, sans-serif; background: #f5f7fa; color: #1a1a2e; }
.loading { display: flex; align-items: center; justify-content: center; height: 100vh; font-size: 1.2rem; color: #666; }`,

            'src/styles/LoginPage.css': `.login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
.login-card { background: white; border-radius: 16px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
.login-header { text-align: center; margin-bottom: 32px; }
.login-header h1 { font-size: 1.8rem; font-weight: 700; color: #1a1a2e; }
.login-header p { color: #666; margin-top: 8px; }
.login-form { display: flex; flex-direction: column; gap: 20px; }
.login-error { background: #fff0f0; border: 1px solid #ffcccc; color: #cc0000; padding: 12px; border-radius: 8px; font-size: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 14px; font-weight: 500; color: #333; }
.form-group input { padding: 12px 16px; border: 2px solid #e0e6ed; border-radius: 8px; font-size: 16px; outline: none; transition: border-color .2s; }
.form-group input:focus { border-color: #667eea; }
.login-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: opacity .2s; }
.login-btn:disabled { opacity: .7; cursor: not-allowed; }`,

            'src/styles/DashboardPage.css': `.dashboard { min-height: 100vh; display: flex; flex-direction: column; }
.dashboard-header { background: white; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.dashboard-header h1 { font-size: 1.4rem; font-weight: 700; color: #667eea; }
.header-user { display: flex; align-items: center; gap: 16px; }
.logout-btn { background: #f0f0f0; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 500; }
.dashboard-main { padding: 32px; flex: 1; }`,

            '.env.example': `VITE_API_URL=http://localhost:3001`,
            '.gitignore': `node_modules\ndist\n.env\n*.local`,
            'README.md': `# {{PROJECT_TITLE}}\n\nReact + TypeScript + Vite con autenticación JWT.\n\n## Setup\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n`,
        });
    }

    // ── Express Node fallback ─────────────────────────────────────────────────

    _genExpress(dest) {
        this._writeFiles(dest, {
            'package.json': JSON.stringify({
                name: "{{PROJECT_NAME}}", version: "1.0.0",
                scripts: {
                    dev: "nodemon src/index.js",
                    start: "node src/index.js",
                },
                dependencies: {
                    express: "^4.18.2", cors: "^2.8.5",
                    helmet: "^7.0.0", dotenv: "^16.3.1",
                    bcryptjs: "^2.4.3", jsonwebtoken: "^9.0.2",
                    "express-validator": "^7.0.1",
                    "@prisma/client": "^5.4.2",
                },
                devDependencies: {
                    nodemon: "^3.0.1", prisma: "^5.4.2",
                },
            }, null, 2),

            'src/index.js': `require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

// Routes
app.use('/api/auth',  require('./routes/auth.routes'))
app.use('/api/users', require('./routes/users.routes'))

// Health
app.get('/health', (_, res) => res.json({ ok: true, env: process.env.NODE_ENV }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(\`🚀 Server running on http://localhost:\${PORT}\`))`,

            'src/routes/auth.routes.js': `const router = require('express').Router()
const authController = require('../controllers/auth.controller')
const { validateLogin, validateRegister } = require('../middleware/validators')

router.post('/login',    validateLogin,    authController.login)
router.post('/register', validateRegister, authController.register)
router.get('/me',        require('../middleware/auth'), authController.me)

module.exports = router`,

            'src/routes/users.routes.js': `const router = require('express').Router()
const auth   = require('../middleware/auth')

router.get('/', auth, (req, res) => {
  res.json({ message: 'Users list — implement me', userId: req.userId })
})

module.exports = router`,

            'src/controllers/auth.controller.js': `const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')

// In production, use your DB (Prisma, etc.)
const users = []

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const exists = users.find(u => u.email === email)
    if (exists) return res.status(400).json({ error: 'Email already registered' })

    const hash = await bcrypt.hash(password, 10)
    const user = { id: Date.now().toString(), name, email, password: hash, role: 'user' }
    users.push(user)

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { password: _, ...safeUser } = user
    res.status(201).json({ ...safeUser, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = users.find(u => u.email === email)
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const { password: _, ...safeUser } = user
    res.json({ ...safeUser, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.me = async (req, res) => {
  const user = users.find(u => u.id === req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password: _, ...safeUser } = user
  res.json(safeUser)
}`,

            'src/middleware/auth.js': `const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = payload.id
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}`,

            'src/middleware/validators.js': `const { body, validationResult } = require('express-validator')

const handle = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  next()
}

exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handle,
]

exports.validateRegister = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  handle,
]`,

            '.env.example': `PORT=3001\nFRONTEND_URL=http://localhost:5173\nJWT_SECRET=change_this_secret_in_production\nDATABASE_URL=`,
            '.gitignore': `node_modules\n.env\ndist`,
            'README.md': `# {{PROJECT_TITLE}} API\n\nExpress + Node.js + JWT Auth\n\n## Setup\n\n\`\`\`bash\nnpm install\ncp .env.example .env\nnpm run dev\n\`\`\`\n\n## Endpoints\n\n- POST /api/auth/register\n- POST /api/auth/login\n- GET  /api/auth/me\n`,
        });
    }

    // ── .NET WebAPI fallback ──────────────────────────────────────────────────

    _genDotNet(dest) {
        const ns = '{{PROJECT_CLASS}}';
        this._writeFiles(dest, {
            '{{PROJECT_NAME}}.csproj': `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>
  <ItemGroup>
    <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
    <PackageReference Include="Microsoft.EntityFrameworkCore.InMemory" Version="8.0.0" />
    <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
    <PackageReference Include="BCrypt.Net-Next" Version="4.0.3" />
  </ItemGroup>
</Project>`,

            'Program.cs': `using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(o => o.AddPolicy("AllowFrontend", p =>
    p.WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:5173")
     .AllowAnyHeader().AllowAnyMethod()));

var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKey12345678901234567890";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o => o.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer   = false,
        ValidateAudience = false,
    });

builder.Services.AddAuthorization();
builder.Services.AddSingleton<UserStore>();

var app = builder.Build();

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();`,

            'Controllers/AuthController.cs': `using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase {
    private readonly UserStore _store;
    private readonly IConfiguration _config;

    public AuthController(UserStore store, IConfiguration config) {
        _store  = store;
        _config = config;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest req) {
        if (_store.FindByEmail(req.Email) != null)
            return BadRequest(new { error = "Email already registered" });

        var user = new User {
            Id       = Guid.NewGuid().ToString(),
            Name     = req.Name,
            Email    = req.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role     = "user",
        };
        _store.Add(user);
        return Ok(new { user.Id, user.Name, user.Email, user.Role, Token = GenerateToken(user) });
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req) {
        var user = _store.FindByEmail(req.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.Password))
            return Unauthorized(new { error = "Invalid credentials" });
        return Ok(new { user.Id, user.Name, user.Email, user.Role, Token = GenerateToken(user) });
    }

    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult Me() {
        var id   = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = _store.FindById(id ?? "");
        if (user == null) return NotFound();
        return Ok(new { user.Id, user.Name, user.Email, user.Role });
    }

    private string GenerateToken(User user) {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "SuperSecretKey12345678901234567890"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            claims: [new Claim(ClaimTypes.NameIdentifier, user.Id), new Claim(ClaimTypes.Email, user.Email)],
            expires: DateTime.Now.AddDays(7),
            signingCredentials: creds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}`,

            'Models/User.cs': `public class User {
    public string Id       { get; set; } = "";
    public string Name     { get; set; } = "";
    public string Email    { get; set; } = "";
    public string Password { get; set; } = "";
    public string Role     { get; set; } = "user";
}

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string Name, string Email, string Password);`,

            'Services/UserStore.cs': `public class UserStore {
    private readonly List<User> _users = new();
    public User? FindByEmail(string email) => _users.FirstOrDefault(u => u.Email == email);
    public User? FindById(string id)       => _users.FirstOrDefault(u => u.Id == id);
    public void Add(User user)             => _users.Add(user);
}`,

            'appsettings.json': JSON.stringify({
                Jwt: { Key: "ChangeThisSecretKeyInProduction1234567890" },
                FrontendUrl: "http://localhost:5173",
                Logging: { LogLevel: { Default: "Information" } },
                AllowedHosts: "*",
            }, null, 2),

            'appsettings.Development.json': JSON.stringify({
                Logging: { LogLevel: { Default: "Debug", Microsoft: "Warning" } },
            }, null, 2),

            '.gitignore': `bin/\nobj/\n*.user\nappsettings.Production.json`,
            'README.md': `# {{PROJECT_TITLE}} API\n\n.NET 8 WebAPI + JWT Auth\n\n## Run\n\n\`\`\`bash\ndotnet restore\ndotnet run\n\`\`\`\n\nSwagger: http://localhost:5000/swagger\n`,
        });
    }

    // ── React JS fallback ─────────────────────────────────────────────────────

    _genReactJS(dest) {
        // Similar to TS but with .jsx extensions
        this._writeFiles(dest, {
            'package.json': JSON.stringify({
                name: "{{PROJECT_NAME}}", private: true, version: "0.1.0", type: "module",
                scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
                dependencies: { react: "^18.2.0", "react-dom": "^18.2.0", "react-router-dom": "^6.18.0", axios: "^1.5.0" },
                devDependencies: { "@vitejs/plugin-react": "^4.0.3", vite: "^4.4.5" },
            }, null, 2),

            'vite.config.js': `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ plugins: [react()], server: { port: 5173, host: true } })`,

            'index.html': `<!DOCTYPE html>
<html lang="es">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>{{PROJECT_TITLE}}</title></head>
  <body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>
</html>`,

            'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><BrowserRouter><App /></BrowserRouter></React.StrictMode>
)`,

            'src/App.jsx': `import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}`,

            'src/context/AuthContext.jsx': `import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001' })
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = 'Bearer ' + t; return c })

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.get('/auth/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false))
    } else { setLoading(false) }
  }, [])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', r.data.token || '')
    setUser(r.data)
  }
  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)`,

            'src/components/ProtectedRoute.jsx': `import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Cargando...</div>
  if (!user)   return <Navigate to="/login" replace />
  return <Outlet />
}`,

            'src/pages/LoginPage.jsx': `import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/LoginPage.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await login(email, password); navigate('/dashboard') }
    catch { setError('Credenciales inválidas') }
    finally { setLoading(false) }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header"><h1>{{PROJECT_TITLE}}</h1><p>Inicia sesión para continuar</p></div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group"><label>Email</label><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" /></div>
          <div className="form-group"><label>Contraseña</label><input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div>
          <button type="submit" className="login-btn" disabled={loading}>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</button>
        </form>
      </div>
    </div>
  )
}`,

            'src/pages/DashboardPage.jsx': `import { useAuth } from '../context/AuthContext'
import '../styles/DashboardPage.css'
export default function DashboardPage() {
  const { user, logout } = useAuth()
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{{PROJECT_TITLE}}</h1>
        <div className="header-user"><span>Hola, {user?.name || user?.email}</span><button onClick={logout} className="logout-btn">Salir</button></div>
      </header>
      <main className="dashboard-main"><h2>Dashboard</h2><p>Bienvenido al sistema.</p></main>
    </div>
  )
}`,

            'src/styles/global.css': `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',system-ui,sans-serif;background:#f5f7fa;color:#1a1a2e}.loading{display:flex;align-items:center;justify-content:center;height:100vh;font-size:1.2rem}`,
            'src/styles/LoginPage.css': `.login-container{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea,#764ba2);padding:20px}.login-card{background:white;border-radius:16px;padding:40px;width:100%;max-width:420px;box-shadow:0 20px 60px rgba(0,0,0,.15)}.login-header{text-align:center;margin-bottom:32px}.login-header h1{font-size:1.8rem;font-weight:700}.login-form{display:flex;flex-direction:column;gap:20px}.login-error{background:#fff0f0;border:1px solid #ffcccc;color:#cc0000;padding:12px;border-radius:8px;font-size:14px}.form-group{display:flex;flex-direction:column;gap:6px}.form-group label{font-size:14px;font-weight:500}.form-group input{padding:12px 16px;border:2px solid #e0e6ed;border-radius:8px;font-size:16px;outline:none}.form-group input:focus{border-color:#667eea}.login-btn{background:linear-gradient(135deg,#667eea,#764ba2);color:white;border:none;padding:14px;border-radius:8px;font-size:16px;font-weight:600;cursor:pointer}`,
            'src/styles/DashboardPage.css': `.dashboard{min-height:100vh}.dashboard-header{background:white;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 2px 8px rgba(0,0,0,.08)}.dashboard-header h1{font-size:1.4rem;font-weight:700;color:#667eea}.header-user{display:flex;align-items:center;gap:16px}.logout-btn{background:#f0f0f0;border:none;padding:8px 16px;border-radius:8px;cursor:pointer}.dashboard-main{padding:32px}`,
            '.env.example': `VITE_API_URL=http://localhost:3001`,
            '.gitignore': `node_modules\ndist\n.env\n*.local`,
        });
    }

    // ── Utils ─────────────────────────────────────────────────────────────────

    _writeFiles(baseDir, files) {
        for (const [relPath, content] of Object.entries(files)) {
            const absPath = path.join(baseDir, relPath);
            fs.mkdirSync(path.dirname(absPath), { recursive: true });
            const str = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
            fs.writeFileSync(absPath, str, 'utf8');
        }
    }

    _walkDir(dir, fn) {
        try {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                const full = path.join(dir, entry.name);
                if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
                    this._walkDir(full, fn);
                } else if (entry.isFile()) {
                    fn(full);
                }
            }
        } catch {}
    }

    _toPascalCase(str) {
        return str.split(/[-_\s]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    }

    emit(event, data) {
        try { this.onEvent(event, { ...data, ts: Date.now() }); } catch {}
    }
}

module.exports = TemplateManager;
