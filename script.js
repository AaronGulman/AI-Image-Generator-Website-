const generateForm = document.querySelector('.generate-form');
const imageGallery = document.querySelector('.image-gallery');

const OPENAI_API_KEY = "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";

const  updateImageCard = (ImgDataArray) => {
	ImgDataArray.forEach((imgObject, index) => {
		const imgCard = imageGallery.querySelector('.img-card')[index];
		const imgElement = imgCard.querySelector('img');

		const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
		imgElement.src = aiGeneratedImg;


		imgElement.onload = () => {
			imgCard.classList.remove("loading");
		}
	})
}

const generateAiImages = async (userPrompt , userImgQuantity) =>{
	try {
		const response = await fetch("https://api.openai.com/v1/images/generations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${OPENAI_API_KEY}`
			},
			body: JSON.stringify({
				prompt: userPrompt,
				n: userImgQuantity,
				size: "512x512",
				response_format: "b64_json"
			})
		});
		if(!response.ok) throw new Error("Failed to generate images! Please try again.");



		const {data} = await response.json();
		updateImageCard([...data]);
	}catch(error){
		alert(error.message);
	}
}


const handleFormSubmission = (e) => {
	e.preventDefault();
	const userPrompt = e.srcElement[0].value;
	const userImgQuantity = e.srcElement[1].value;

	const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
		`<div class="img-card loading">
		<img src="./assets/loader.svg" alt="loading picture">
		<a href="#" class="download-btn">
			<img class="download" src="./assets/download.svg" alt="">
		</a>
	</div>`
	).join('');
	
	imageGallery.innerHTML = imgCardMarkup;
	generateAiImages(userPrompt, userImgQuantity)
}


generateForm.addEventListener('submit',handleFormSubmission)