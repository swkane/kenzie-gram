let failedAttempts = 0;
let clientTimeStamp = Date.now();

function fetchImages() {
    const postRequestOptions = {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            after: clientTimeStamp
        })
    }
    fetch('/latest', postRequestOptions)
        .then(response => response.json())
        .then(responseData => {
            failedAttempts = 0;
            console.log(responseData);
            clientTimeStamp = responseData.timestamp;
            for (let i = 0; i < responseData.images.length; i++) {
                let newImage = document.createElement('img');
                newImage.src = `uploads/${responseData.images[i]}`;
                let firstImage = document.getElementsByTagName('img')[0];
                document.body.insertBefore(newImage, firstImage);
                console.log(`inserted ${responseData.images[i]}`);
            }
            return responseData;
        })
        .catch(() => {
            failedAttempts++;
            console.log(`FailedAttemps: ${failedAttempts}`);
            if (failedAttempts == 2) {
                alert('Connection Lost');
            }
        });
}
setInterval(() => fetchImages(), 5000);

