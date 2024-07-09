const generateForm = document.querySelector('.generate-form');
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector('.image-gallery');

const OPENAI_API_KEY = "ENTER YOUR OPENAI_API_KEY";
let isImageGenerating = false;

const  updateImageCard = (imgDataArray) => {
	imgDataArray.forEach((imgObject, index) => {
		const imgCard = imageGallery.querySelectorAll('.img-card')[index];
		const imgElement = imgCard.querySelector('img');
		const downloadBtn = imgCard.querySelector('.download-btn')

		const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
		imgElement.src = aiGeneratedImage;


		imgElement.onload = () => {
			imgCard.classList.remove("loading");
			downloadBtn.setAttribute('href,aiGeneratedImage')
			downloadBtn.setAttribute('download',`${new Date().getTime()}.jpg`);
		}
	});
}

const generateAiImages = async (userPrompt , userImgQuantity) =>{
	try {
		const response = await fetch("https://api.openai.com/v1/images/generations", {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			  "Authorization": `Bearer ${OPENAI_API_KEY}`,
			},
			body: JSON.stringify({
				prompt: userPrompt,
				n: userImgQuantity,
				size: "512x512",
				response_format: "b64_json"
			      }),
			    });			
		if(!response.ok) throw new Error("Failed to generate images! Please try again.");



		const { data } = await response.json();
		updateImageCard([...data]);
	}catch(error){
		alert(error.message);
	}finally{
		generateBtn.removeAttribute("disabled");
		generateBtn.innerText = "Generate";
		isImageGenerating = false;
	}
}


const handleFormSubmission = (e) => {
	e.preventDefault();
	if(isImageGenerating) return;
	isImageGenerating = true;


	const userPrompt = e.srcElement[0].value;
	const userImgQuantity = parseInt(e.srcElement[1].value);

	generateBtn.setAttribute("disabled", true);
	generateBtn.innerText = "Generating";
	isImageGenerating = true;

	const imgCardMarkup = Array.from({length: userImgQuantity}, () =>
		`<div class="img-card loading">
		<img src="./assets/loader.svg" alt="loading picture">
		<a href="#" class="download-btn">
			<img src="./assets/download.svg" alt="download icon">
		</a>
	</div>`
	).join('');
	
	imageGallery.innerHTML = imgCardMarkup;
	generateAiImages(userPrompt, userImgQuantity)
}


generateForm.addEventListener('submit',handleFormSubmission)