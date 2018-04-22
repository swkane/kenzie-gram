console.log('hello');

let latestTimestamp = 1524260386000;

const postRequestOptions = {
    method: "POST",
    headers: new Headers({
        "Content-Type": "application/json"
    }),
    body: JSON.stringify({
        after: latestTimestamp
    })
}

function fetchImages() {
    fetch('/latest', postRequestOptions)
        .then(response => response.json())
        .then(responseData => {
            console.log(responseData);
            latestTimestamp = responseData.timestamp;
            return responseData;
        });
    setTimeout(() => fetchImages(), 5000);
}

fetchImages();
