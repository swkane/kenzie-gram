console.log('hello');

let beginningTimeStamp = 1524260386000;

function fetchImages(latestTimestamp = beginningTimeStamp) {
    const postRequestOptions = {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json"
        }),
        body: JSON.stringify({
            after: latestTimestamp
        })
    }
    fetch('/latest', postRequestOptions)
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData);
            latestTimestamp = responseData.timestamp;
            for (let i = 0; i < responseData.images.length; i++) {
                let newImage = document.createElement('img');
                newImage.src = `uploads/${responseData.images[i]}`;
                let firstImage = document.getElementsByTagName('img')[0];
                document.body.insertBefore(newImage, firstImage);
                console.log(`inserted ${responseData.images[i]}`);
            }
            return responseData;
        });
    setTimeout(() => fetchImages(latestTimestamp), 5000);
}

fetchImages(beginningTimeStamp);
