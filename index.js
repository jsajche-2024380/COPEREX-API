import { env } from './configs/app.js';
import { connectMongo } from './configs/mongo.js';
import app from './configs/server.js';
import { checkAndCreateDefaultAdmin } from './seeds/admin.seed.js';

const startApp = async () => {
    try {
        await connectMongo();
        await checkAndCreateDefaultAdmin();
        app.listen(env.PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${env.PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar la aplicación:', error.message);
        process.exit(1);
    }
};

startApp();
