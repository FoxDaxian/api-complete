import * as net from 'net';

interface CallbackFn {
    (err: null, inUse: boolean): void;
    (err: NodeJS.ErrnoException): void;
}

export default function isPortTaken(port: number, fn: CallbackFn) {
    const tester = net
        .createServer()
        .once('error', function (err: NodeJS.ErrnoException) {
            if (err.code !== 'EADDRINUSE') {
                return fn(err);
            }
            fn(null, true);
        })
        .once('listening', function () {
            tester
                .once('close', function () {
                    fn(null, false);
                })
                .close();
        })
        .listen(port, '0.0.0.0'); // todo
}