import Elysia from "elysia";

export const ws = new Elysia({ name: 'ws-router' })
    .state('clients', {
        chat: new Set<any>(),
        notify: new Set<any>()
    })

    .ws('*', {
        open(ws) {
            if (ws.url === '/chat') {
                ws.store.clients.chat.add(ws)
                ws.send('Conectado al chat')
                return
            }

            if (ws.url === '/notify') {
                ws.store.clients.notify.add(ws)
                ws.send('Conectado a notificaciones')
                return
            }

            ws.close()
        },

        message(ws, message) {
            if (ws.url === '/chat') {
                for (const c of ws.store.clients.chat)
                    c.send(message)
            }

            if (ws.url === '/notify') {
                ws.send({ ok: true })
            }
        },

        close(ws) {
            ws.store.clients.chat.delete(ws)
            ws.store.clients.notify.delete(ws)
        }
    })
