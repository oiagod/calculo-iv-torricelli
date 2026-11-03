"""Servidor local do simulador, sem cache.

O `python3 -m http.server` não manda Cache-Control, e o navegador guarda os módulos JS antigos:
depois de editar `src/physics/` ou `scenes/`, a página continua com a versão velha mesmo com
Cmd+Shift+R. Aqui toda resposta vai com `Cache-Control: no-store`.

Uso: python3 serve.py [porta]   (padrão 8001) e abra http://localhost:8001/
"""
import functools
import http.server
import pathlib
import sys


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    root = pathlib.Path(__file__).resolve().parent   # serve a pasta do projeto, de onde quer que seja chamado
    handler = functools.partial(NoStoreHandler, directory=str(root))
    with http.server.ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"Simulador em http://localhost:{port}/  (Ctrl+C para parar)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
