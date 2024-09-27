const API_KEY = "46083501-c528543f1567e7a7f2fa0abc2"; 
const formElement = document.querySelector("form"); 
const searchBoxElement = document.getElementById("searchBox"); 
const searchResultsElement = document.querySelector(".Categories"); 
const searchLinkElement = document.querySelectorAll(".searchLink");
const showMoreButton = document.getElementById("showMoreBtn");
const suggestionResults = document.getElementById("suggestionResults"); 
const category_element = document.querySelector("h2")
const ModalResults_element = document.getElementById("ModalResults");
const modal = document.getElementById("NewModal");
const modalImg = document.getElementById("modalImage");
const modalDescr = document.getElementById("modalText");
const downloadButton = document.getElementById("downloadButton");
const closeModal = document.getElementById("closeModal");
const suggestImageelement = document.querySelectorAll(".suggImg")


let inputValues = ""; 
let page = 1; 

async function getImages(){
    inputValues = searchBoxElement.value;; 
    const url = `https://pixabay.com/api/?key=${API_KEY}&page=${page}&q=${inputValues}`; 
    try { 
        const response = await fetch(url); 
        const data = await response.json(); 
        const results = data.hits; 
        if (results && results.length > 0){ 
            if (page === 1) { 
                searchResultsElement.innerHTML = ""; 
            } 
            results.map((result) => { 
                const imageWrapper = document.createElement("div"); 
                imageWrapper.classList.add("category"); 
                const image = document.createElement("img"); 
                image.src = result.webformatURL;  
                image.alt = result.tags; 

                image.addEventListener('click', ()=>{
                    modalImg.src = result.largeImageURL;
                    modalDescr.textContent = result.tags;
                    downloadButton.href = result.largeImageURL;
                    downloadButton.download = `image=${result.id}.jpg`
                    modal.style.display = "flex";
                });
                const imageLink = document.createElement("a"); 
                imageLink.href = result.pageURL; 
                imageLink.target = "_blank"; 
                imageLink.textContent = result.tags;  
                imageWrapper.appendChild(image); 
                imageWrapper.appendChild(imageLink); 
                searchResultsElement.appendChild(imageWrapper);  
            }); 
            page++;   
            
            if (page > 1) { 
                showMoreButton.style.display = "block"; 
                BackButton_Element.style.display = "block";
            } 
        } else { 
            console.error('No results found.'); 
        } 
    } catch (error) {
         console.error('Error fetching images:', error); 
        } 
    } 

function changeDisplay(){
    let searchValues = searchBoxElement.value;
    category_element.style.display = "block";
    suggestionResults.style.display = "none"; 
    category_element.style.color = "#00b3ff";
    category_element.style.textTransform = "capitalize";
    category_element.style.fontWeight = "bold";
    category_element.innerHTML =  "Search Results for '"+searchValues+"' :-"; 
}

formElement.addEventListener("submit", (event) => { 
    event.preventDefault(); 
    changeDisplay();
    page = 1; 
    getImages();
}); 
        
showMoreButton.addEventListener("click", () => { 
    getImages();  
});

searchLinkElement.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const searchTerm = event.target.textContent;
        searchBoxElement.value = searchTerm;
        suggestionResults.innerHTML = "Suggestion Results for '"+searchTerm+"' :";
        suggestionResults.style.display = "block"; 
        category_element.style.display = "none";
        window.scrollTo({ top: 350, behavior: 'instant'});
        getImages(); 
    })
})
 
let BackButton_Element = document.getElementById("BackButton");
BackButton_Element.addEventListener("click", function(){
    window.location.href = "index.html";
} );

closeModal.addEventListener('click', () => {
    modal.style.display = "none";
})

async function  downloadImage(blob){
    try{
        const val = {
            types: [{
                description: 'Images',
                accept: {
                    'image/jpeg': ['.jpg']
                }
            }],
            suggestedName:  'picture.jpg'
        };
        const file = await window.showSaveFilePicker(val);

        const writable = await file.createWritable();
        await writable.write(blob);
        await writable.close();
        console.log("File Downloaded Successfully!!");
    }catch(error){
        console.error("Error Dowloading the File!!");
    }
}

downloadButton.addEventListener("click", async (event) =>{
    event.preventDefault();
    const response = await fetch(downloadButton.href);
    const blob = await response.blob();
    downloadImage(blob);
    
})

suggestImageelement.forEach((imageElement) => {
    imageElement.addEventListener("click", async(event) => {
        event.preventDefault();
        const searchTerm = event.target.alt;
        searchBoxElement.value = searchTerm;
        suggestionResults.innerHTML = "Suggestion Results for '"+searchTerm+"' :";
        suggestionResults.style.display = "block"; 
        category_element.style.display = "none";
        window.scrollTo({ top: 350, behavior: 'instant'});
        getImages(); 
    });
});