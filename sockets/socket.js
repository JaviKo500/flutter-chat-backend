const { io } = require('../index');

const Bands = require('../models/bands');
const Band = require('../models/band');
const { checkJWT } = require('../helpers/jwt');
const { userConnect, userDisconnect, saveMessage } = require('../controllers/socket');

const bands = new Bands();

bands.addBand( new Band( 'Breaking Benjamin' ) );
bands.addBand( new Band( 'Bon Jovi' ) );
bands.addBand( new Band( 'Héroes del Silencio' ) );
bands.addBand( new Band( 'Metallica' ) );


// Mensajes de Sockets
io.on('connection', client => {
    const [valid, uid] = checkJWT(client.handshake.headers['x-token']);
    if ( !valid ) {
        return client.disconnect();
    }
    console.log('Cliente conectado');
    console.log(valid, uid);
    // client authtetificated
    userConnect(uid);   
    // enter user a sale
    // globa sale
    // client.id 
    client.join(uid);
    // listen client personal-message
    client.on('personal-message', async (payload) => {
        console.log(payload);
        // TODO: Save message
        await saveMessage(payload);
        io.to( payload.to ).emit('personal-message', payload);
    });
    client.on('disconnect', () => {
        userDisconnect(uid);
        console.log('Cliente desconectado');
    });
});
