const generateForm = document.querySelector('.generate-form');

const handleFormSubmission = (e) => {
	e.preventDefault();
	const userPrompt = e.srcElement[0].value;
	const userImgQuantity = e.srcElement[1].value;

	console.log(userPrompt,userImgQuantity)

}


generateForm.addEventListener('submit',handleFormSubmission)