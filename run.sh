cd host || exit 1

python3 -m http.server 80 &
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
    rm -rf ../host/*
    cp -rf ../static/* .
    sleep 1
done