/*=====================================================
                BÍBLIA MHD
                leitor.js
                PARTE 1/5
======================================================*/


"use strict";



/*=====================================================
ESTADO DO LEITOR
======================================================*/


const ReaderApp = {


    bible:

        null,


    book:

        null,


    chapter:

        null,


    chapterData:

        null,


    verses:

        [],


    fontSize:

        localStorage.getItem("mhd_font")

        ||

        "18"



};





/*=====================================================
ELEMENTOS
======================================================*/


const readerElements = {


    content:

        document.getElementById("bibleContent"),



    bookName:

        document.getElementById("bookName"),



    chapterNumber:

        document.getElementById("chapterNumber"),



    bookVersion:

        document.getElementById("bookVersion"),



    audio:

    document.getElementById("audio"),



playAudio:

    document.getElementById("playAudio"),



pauseAudio:

    document.getElementById("pauseAudio"),



stopAudio:

    document.getElementById("stopAudio"),


    increaseFont:

        document.getElementById("increaseFont"),



    decreaseFont:

        document.getElementById("decreaseFont"),



    darkMode:

        document.getElementById("darkMode"),



    share:

        document.getElementById("share")



};





/*=====================================================
INICIALIZAÇÃO
======================================================*/


document.addEventListener(

    "DOMContentLoaded",

    initializeReader

);





async function initializeReader(){


    try{


        getURLParameters();



        applyFontSize();



        configureButtons();



        await loadChapter();



    }


    catch(error){


        console.error(

            "Erro leitor:",

            error

        );



        showReaderError();



    }


}






/*=====================================================
LER PARÂMETROS DA URL
======================================================*/


function getURLParameters(){


    const params =

        new URLSearchParams(

            window.location.search

        );



    ReaderApp.bible =
    "41a6caa722a21d88-01";



    ReaderApp.book =

        params.get("book");



    ReaderApp.chapter =

        params.get("chapter");



    console.log(

        "Leitor:",

        ReaderApp

    );


}
/*=====================================================
                BÍBLIA MHD
                leitor.js
                PARTE 2/5
======================================================*/


/*=====================================================
CARREGAR CAPÍTULO
======================================================*/


async function loadChapter(){


    try{


        showLoading();



        const response =

            await getChapter(

                ReaderApp.chapter,

                ReaderApp.bible

            );



        ReaderApp.chapterData =

            response.data;



        await loadVerses();



        updateHeader();



    }


    catch(error){


        console.error(

            "Erro ao carregar capítulo:",

            error

        );



        showReaderError();


    }



}





/*=====================================================
CARREGAR VERSÍCULOS
======================================================*/

async function loadVerses(){


    const response = await getVerses(

        ReaderApp.chapter,

        ReaderApp.bible

    );


    ReaderApp.verses = [];



    for(const verse of response.data){


        const detail = await getVerse(

            verse.id,

            ReaderApp.bible

        );



        ReaderApp.verses.push(

            detail.data

        );


    }



    console.log(

        "Versículos carregados:",

        ReaderApp.verses

    );


    renderVerses();


}






function removeVerseNumber(text){

    if(!text)

        return "";


    return text.replace(

        /^\d+\s*/,

        ""

    ).trim();

}


/*=====================================================
MOSTRAR VERSÍCULOS
======================================================*/

function renderVerses(){

    if(!readerElements.content)

        return;


    let html = "";


    ReaderApp.verses.forEach(verse=>{


        let number = "";

        if(verse.reference){

            number = verse.reference
                .split(".")
                .pop();

        }


        html += `

        <article class="verse">


            <span class="verseNumber">

                ${number}

            </span>


<p class="verseText">

    ${removeVerseNumber(cleanVerseText(verse.content))}

</p>


        </article>


        `;


    });


    readerElements.content.innerHTML = html;


    applyFontSize();


}

/*=====================================================
ACTUALIZAR CABEÇALHO
======================================================*/


function updateHeader(){


    if(readerElements.chapterNumber){


        readerElements.chapterNumber.textContent =

            ReaderApp.chapterData.reference;


    }



    if(readerElements.bookName){


        readerElements.bookName.textContent =

            ReaderApp.chapterData.reference;


    }



    if(readerElements.bookVersion){


        readerElements.bookVersion.textContent =

            "Nova Versão Transformadora";


    }



}





/*=====================================================
CARREGAMENTO
======================================================*/


function showLoading(){


    if(readerElements.content){


        readerElements.content.innerHTML = `


        <div class="loading-reader">


            <i class="fas fa-spinner fa-spin"></i>


            <p>

            A carregar a Palavra de Deus...

            </p>


        </div>


        `;


    }


}

/*=====================================================
                BÍBLIA MHD
                leitor.js
                PARTE 3/5
======================================================*/


/*=====================================================
CONFIGURAR BOTÕES
======================================================*/


function configureButtons(){



    if(readerElements.increaseFont){


        readerElements.increaseFont.addEventListener(

            "click",

            increaseFont

        );


    }





    if(readerElements.decreaseFont){


        readerElements.decreaseFont.addEventListener(

            "click",

            decreaseFont

        );


    }





    if(readerElements.darkMode){


        readerElements.darkMode.addEventListener(

            "click",

            toggleDarkMode

        );


    }





    if(readerElements.share){


        readerElements.share.addEventListener(

            "click",

            shareVerse

        );


    }


}







/*=====================================================
TAMANHO DA LETRA
======================================================*/


function increaseFont(){


    let size =

        parseInt(

            ReaderApp.fontSize

        );



    size += 2;



    ReaderApp.fontSize =

        size;



    saveFont();



    applyFontSize();


}





function decreaseFont(){


    let size =

        parseInt(

            ReaderApp.fontSize

        );



    size -= 2;



    if(size < 12){


        size = 12;


    }



    ReaderApp.fontSize =

        size;



    saveFont();



    applyFontSize();


}







function applyFontSize(){


    const verses = document.querySelectorAll(
        ".verseText"
    );


    verses.forEach(text=>{


        text.style.fontSize =

            ReaderApp.fontSize + "px";


    });


    localStorage.setItem(

        "mhd_font",

        ReaderApp.fontSize

    );


}






function saveFont(){


    localStorage.setItem(

        "mhd_font",

        ReaderApp.fontSize

    );


}







/*=====================================================
MODO ESCURO
======================================================*/


function toggleDarkMode(){


    document.body.classList.toggle(

        "dark-reader"

    );



    localStorage.setItem(

        "mhd_dark",

        document.body.classList.contains(

            "dark-reader"

        )

    );


}







function loadDarkMode(){


    const dark =

        localStorage.getItem(

            "mhd_dark"

        );



    if(dark==="true"){


        document.body.classList.add(

            "dark-reader"

        );


    }


}

/*=====================================================
                BÍBLIA MHD
                leitor.js
                PARTE 4/5
======================================================*/


/*=====================================================
PARTILHAR
======================================================*/


function shareVerse(){


    let text = "";



    ReaderApp.verses.forEach(verse=>{


        text +=

        (

            verse.text

            ||

            ""

        )

        +

        "\n";


    });




    const shareData = {


        title:

            "Bíblia MHD",


        text:

            text.substring(0,500)

            +

            "\n\nBíblia MHD"


    };





    if(navigator.share){



        navigator.share(

            shareData

        );



    }

    else{


        navigator.clipboard.writeText(

            text

        );



        alert(

            "Texto copiado."

        );


    }



}






/*=====================================================
ERRO DO LEITOR
======================================================*/


function showReaderError(){



    if(readerElements.content){



        readerElements.content.innerHTML = `



        <div class="reader-error">



            <h3>

                Não foi possível carregar este capítulo.

            </h3>



            <p>

                Verifique a ligação com a Bíblia MHD.

            </p>



        </div>



        `;


    }



}







/*=====================================================
CAPÍTULO ANTERIOR
======================================================*/


async function previousChapter(){


    const number =

        parseInt(

            ReaderApp.chapter.split(".").pop()

        );



    if(number <= 1)

        return;




    const newChapter =

        ReaderApp.book +

        "." +

        (number-1);




    window.location.href =


        `leitor.html?bible=${ReaderApp.bible}&book=${ReaderApp.book}&chapter=${newChapter}`;



}






/*=====================================================
PRÓXIMO CAPÍTULO
======================================================*/


async function nextChapter(){


    const number =

        parseInt(

            ReaderApp.chapter.split(".").pop()

        );



    const newChapter =


        ReaderApp.book +

        "." +

        (number+1);




    window.location.href =


        `leitor.html?bible=${ReaderApp.bible}&book=${ReaderApp.book}&chapter=${newChapter}`;



}






/*=====================================================
BOTÕES DE NAVEGAÇÃO
======================================================*/


document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        const previous =

            document.getElementById(

                "previousChapter"

            );



        const next =

            document.getElementById(

                "nextChapter"

            );



        if(previous){


            previous.addEventListener(

                "click",

                previousChapter

            );


        }




        if(next){


            next.addEventListener(

                "click",

                nextChapter

            );


        }



    }

);

/*=====================================================
                BÍBLIA MHD
                leitor.js
                PARTE 5/5
======================================================*/


/*=====================================================
CARREGAR CONFIGURAÇÕES GUARDADAS
======================================================*/


document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        loadDarkMode();


    }

);





/*=====================================================
INFORMAÇÕES DO LEITOR
======================================================*/


function debugReader(){


    console.table({


        Biblia:

            ReaderApp.bible,


        Livro:

            ReaderApp.book,


        Capitulo:

            ReaderApp.chapter,


        Versiculos:

            ReaderApp.verses.length



    });


}





/*=====================================================
FAVORITOS
======================================================*/


function saveFavorite(){


    const favorites = JSON.parse(

        localStorage.getItem(

            "mhd_favorites"

        )

        ||

        "[]"

    );



    favorites.push({


        bible:

            ReaderApp.bible,


        chapter:

            ReaderApp.chapter,


        date:

            new Date().toISOString()



    });



    localStorage.setItem(

        "mhd_favorites",

        JSON.stringify(

            favorites

        )

    );


}






const favoriteButton =

document.getElementById(

    "favorite"

);



if(favoriteButton){


    favoriteButton.addEventListener(

        "click",

        ()=>{


            saveFavorite();



            alert(

                "Capítulo guardado nos favoritos."

            );


        }

    );


}






/*=====================================================
BOTÃO NOTAS
======================================================*/


const noteButton =

document.getElementById(

    "note"

);



if(noteButton){


    noteButton.addEventListener(

        "click",

        ()=>{


            const note = prompt(

                "Escreva a sua nota:"

            );



            if(note){



                localStorage.setItem(

                    "mhd_note_" +

                    ReaderApp.chapter,

                    note

                );


            }



        }

    );


}






/*=====================================================
ÁUDIO DA BÍBLIA
======================================================*/


let speech = null;



function playBibleAudio(){


    if(!ReaderApp.verses.length)

        return;



    let text = "";



    ReaderApp.verses.forEach(verse=>{


        text +=

        removeVerseNumber(
            cleanVerseText(
                verse.content
            )
        )

        + ". ";


    });



    speech = new SpeechSynthesisUtterance(text);


    speech.lang = "pt-PT";

    speech.rate = 0.9;

    speech.pitch = 1;


    window.speechSynthesis.cancel();


    window.speechSynthesis.speak(
        speech
    );

}




function pauseBibleAudio(){

    window.speechSynthesis.pause();

}




function stopBibleAudio(){

    window.speechSynthesis.cancel();

}




// LIGAÇÃO DOS BOTÕES

if(readerElements.playAudio){

    readerElements.playAudio.addEventListener(
        "click",
        playBibleAudio
    );

}



if(readerElements.pauseAudio){

    readerElements.pauseAudio.addEventListener(
        "click",
        pauseBibleAudio
    );

}



if(readerElements.stopAudio){

    readerElements.stopAudio.addEventListener(
        "click",
        stopBibleAudio
    );

}



/*=====================================================
FINAL
======================================================*/


window.ReaderApp = ReaderApp;


window.debugReader = debugReader;



console.log(

    "✅ Leitor Bíblia MHD carregado."

);

function cleanVerseText(text){

    if(!text)

        return "";


    return text
        .replace(/^\d+\s*/, "")
        .replace(/<[^>]*>/g,"")
        .trim();

}