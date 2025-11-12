const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 INICIANDO AUTO-MARKETING PRO...\n');

// Verificar que Node.js esté instalado
console.log('✅ Node.js version:', process.version);

// Crear estructura de archivos automáticamente
function createFileStructure() {
    console.log('📁 Creando estructura de archivos...');
    
    const directories = [
        'backend/routes',
        'backend/services', 
        'frontend/public/assets/css',
        'frontend/public/assets/js'
    ];

    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`✅ Carpeta creada: ${dir}`);
        }
    });

    // Crear archivos esenciales si no existen
    const essentialFiles = {
        'backend/package.json': JSON.stringify({
            "name": "automarketing-backend",
            "version": "1.0.0",
            "main": "server.js",
            "scripts": {
                "start": "node server.js",
                "dev": "node server.js"
            },
            "dependencies": {
                "express": "^4.18.2",
                "cors": "^2.8.5",
                "axios": "^1.5.0"
            }
        }, null, 2),
        
        'frontend/package.json': JSON.stringify({
            "name": "automarketing-frontend", 
            "version": "1.0.0",
            "scripts": {
                "start": "node server.js"
            },
            "dependencies": {}
        }, null, 2)
    };

    Object.entries(essentialFiles).forEach(([filePath, content]) => {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Archivo creado: ${filePath}`);
        }
    });
}

// Instalar dependencias automáticamente
function installDependencies() {
    console.log('\n📦 Instalando dependencias...');
    
    exec('cd backend && npm install', (error, stdout, stderr) => {
        if (error) {
            console.log('⚠️  Error instalando backend, continuando...');
        } else {
            console.log('✅ Dependencias del backend instaladas');
        }
        
        // Iniciar servidores
        startServers();
    });
}

// Iniciar servidores
function startServers() {
    console.log('\n🔧 Iniciando servidores...');
    
    // Iniciar backend
    const backendProcess = exec('cd backend && node server.js', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ Error backend:', error.message);
        }
    });

    backendProcess.stdout.on('data', (data) => {
        console.log(`🔧 Backend: ${data}`);
    });

    // Esperar y iniciar frontend
    setTimeout(() => {
        const frontendProcess = exec('cd frontend && node server.js', (error, stdout, stderr) => {
            if (error) {
                console.log('❌ Error frontend:', error.message);
            }
        });

        frontendProcess.stdout.on('data', (data) => {
            console.log(`🌐 Frontend: ${data}`);
        });

    }, 3000);

    console.log('\n🎉 SISTEMA INICIADO EXITOSAMENTE!');
    console.log('📊 Backend: http://localhost:3000');
    console.log('🌐 Frontend: http://localhost:8080');
    console.log('\n💡 Abre http://localhost:8080 en tu navegador');
}

// Ejecutar secuencia de inicio
createFileStructure();
installDependencies();