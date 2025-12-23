python3 server.py &
SERVER=$!

cleanup (){
    echo "Stopping Server!"
    kill $SERVER
    wait $SERVER
    echo "Done!"
    exit 0
}

trap cleanup INT

while true; do
    clear
    echo "Compiling"
    cargo build --release --target wasm32-unknown-unknown
    echo "Packing"
    wasm-bindgen --out-dir wasm target/wasm32-unknown-unknown/release/web.wasm
    echo "Copying Data..."
    rm -rf host/*
    cp -rf wasm/* host
    cp -rf static/* host
    echo "Done!"
    inotifywait -r -e modify,create,delete,move chess static web
done