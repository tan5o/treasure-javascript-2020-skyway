(async function(){
    console.log("hello treasure");

    try{
        const localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true}) 
        // 成功時にvideo要素にカメラ映像をセットし、再生
        const videoElment = document.getElementById('my-video')
        videoElment.srcObject = localStream;
        videoElment.play();

        //Peer作成
        const peer = new Peer({
            key: '511a06ce-bcf4-458a-a3c7-6b41930de4ee',
            debug: 3
        });
        //PeerID取得
        peer.on('open', () => {
            document.getElementById('my-id').textContent = peer.id;
        });
        
        // 発信処理
        document.getElementById('make-call').onclick = () => {
        const theirID = document.getElementById('their-id').value;
        const mediaConnection = peer.call(theirID, localStream);
        setEventListener(mediaConnection);
        };

        // イベントリスナを設置する関数
        const setEventListener = mediaConnection => {
        mediaConnection.on('stream', stream => {
            // video要素にカメラ映像をセットして再生
            const videoElm = document.getElementById('their-video')
            videoElm.srcObject = stream;
            videoElm.play();
        });
        }

        //着信処理
        peer.on('call', mediaConnection => {
            mediaConnection.answer(localStream);
            setEventListener(mediaConnection);
        });

        peer.on('close', () => {
            alert('通信が切断しました。');
        });

    }
    catch(error){
        alert(error)
    }
})();