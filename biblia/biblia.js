/*=====================================================
                BÍBLIA MHD
                biblia.js
                PARTE 1/5
======================================================*/

"use strict";


/*=====================================================
ESTADO DA APLICAÇÃO
======================================================*/


const BibleApp = {

    currentBible:

        localStorage.getItem("mhd_bible")
        ||
        CONFIG.DEFAULT_BIBLE,


    currentBook:null,


    books:[],


    initialized:false

};



/*=====================================================
ELEMENTOS HTML
======================================================*/


const elements = {


    bibleSelector:

        document.getElementById("bibleSelector"),



    searchForm:

        document.getElementById("searchForm"),



    searchInput:

        document.getElementById("searchInput"),



    results:

        document.getElementById("resultadoConteudo"),



    loader:

        document.getElementById("loader"),



    error:

        document.getElementById("errorMessage"),



    bookLinks:

        document.querySelectorAll(".book-link")

};



/*=====================================================
INICIAR APLICAÇÃO
======================================================*/


document.addEventListener(

    "DOMContentLoaded",

    initializeBible

);



async function initializeBible(){


    try{


        showLoader();


        hideError();



        /*
        Remove Bíblia antiga CSB
        */

        if(

            BibleApp.currentBible ===

            "a556c5305ee15c3f-01"

        ){


            BibleApp.currentBible =

                CONFIG.DEFAULT_BIBLE;



            localStorage.setItem(

                "mhd_bible",

                CONFIG.DEFAULT_BIBLE

            );


        }



        configureBibleSelector();


        configureBookLinks();


        configureSearch();



        await loadBooks();



        BibleApp.initialized=true;



        console.log(

            "Bíblia MHD carregada."

        );



    }

    catch(error){


        console.error(

            "Erro inicialização:",

            error

        );


        showError(

            "Não foi possível carregar a Bíblia."

        );


    }

    finally{


        hideLoader();


    }


}



/*=====================================================
LOADER
======================================================*/


function showLoader(){


    if(elements.loader){


        elements.loader.style.display="flex";


    }


}



function hideLoader(){


    if(elements.loader){


        elements.loader.style.display="none";


    }


}



/*=====================================================
ERROS
======================================================*/


function showError(message){


    if(!elements.error)

        return;



    elements.error.innerHTML = message;



    elements.error.style.display="block";


}



function hideError(){


    if(!elements.error)

        return;



    elements.error.style.display="none";


}



/*=====================================================
RESULTADOS
======================================================*/


function clearResults(){


    if(elements.results){


        elements.results.innerHTML="";


    }


}



function setResults(content){

    if(elements.results){

        elements.results.innerHTML = content;

    }


    const section = document.getElementById(
        "resultadoPesquisa"
    );


    if(section){

        section.style.display = "block";

        section.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }

}



/*=====================================================
SELECIONAR BÍBLIA
======================================================*/


function configureBibleSelector(){


    if(!elements.bibleSelector)

        return;



    elements.bibleSelector.value =

        BibleApp.currentBible;



    elements.bibleSelector.addEventListener(

        "change",

        async function(){


            BibleApp.currentBible =

                this.value;



            localStorage.setItem(

                "mhd_bible",

                this.value

            );



            await loadBooks();



            clearResults();



        }

    );


}



/*=====================================================
CARREGAR LIVROS DA API
======================================================*/


async function loadBooks(){


    try{


        const response =

            await getBooks(

                BibleApp.currentBible

            );



        BibleApp.books =

            response.data;



        console.log(

            "Livros carregados:",

            BibleApp.books.length

        );


    }


    catch(error){


        console.error(

            "Erro livros:",

            error

        );


        throw error;


    }


}
/*=====================================================
                BÍBLIA MHD
                biblia.js
                PARTE 2/5
======================================================*/


/*=====================================================
CONFIGURAR LIVROS
======================================================*/


function configureBookLinks(){


    if(!elements.bookLinks.length)

        return;



    elements.bookLinks.forEach(link=>{


        link.addEventListener(

            "click",

            async function(event){


                event.preventDefault();



                elements.bookLinks.forEach(book=>{


                    book.classList.remove(

                        "active"

                    );


                });



                this.classList.add(

                    "active"

                );



                const bookId =

                    this.dataset.bookId;



                await openBook(bookId);



            }

        );


    });


}



/*=====================================================
ABRIR LIVRO
======================================================*/


async function openBook(bookId){


    try{


        hideError();


        showLoader();



        BibleApp.currentBook = bookId;



        const response =

            await getChapters(

                bookId,

                BibleApp.currentBible

            );



        displayChapters(

            response.data

        );



    }


    catch(error){


        console.error(

            "Erro capítulos:",

            error

        );



        showError(

            "Não foi possível carregar os capítulos."

        );


    }


    finally{


        hideLoader();


    }


}



/*=====================================================
MOSTRAR CAPÍTULOS
======================================================*/


function displayChapters(chapters){


    clearResults();



    if(

        !chapters ||

        chapters.length===0

    ){


        setResults(`

            <div class="text-center">

                <h3>

                    Nenhum capítulo encontrado.

                </h3>

            </div>

        `);


        return;


    }



    const book =

        getCurrentBook();



    let html = `


        <section class="chapters-container">


            <div class="chapters-header">


                <h2>

                    ${

                    book ?

                    book.name :

                    ""

                    }

                </h2>


                <p>

                    ${chapters.length}

                    capítulos

                </p>


            </div>



            <div class="chapters-grid">

    `;



    chapters.forEach(chapter=>{


        html += `


            <button

                class="chapter-button"

                data-id="${chapter.id}"

            >

                ${chapter.number}

            </button>


        `;


    });



    html += `


            </div>


        </section>


    `;



    setResults(html);



    configureChapterButtons();


}



/*=====================================================
BOTÕES DOS CAPÍTULOS
======================================================*/


function configureChapterButtons(){


    document

    .querySelectorAll(

        ".chapter-button"

    )

    .forEach(button=>{


        button.addEventListener(

            "click",

            ()=>{


                openChapter(

                    button.dataset.id

                );


            }

        );


    });


}



/*=====================================================
ABRIR CAPÍTULO NO LEITOR
======================================================*/


function openChapter(chapterId){


    saveHistory(

        BibleApp.currentBook,

        chapterId

    );



    const params =

        new URLSearchParams({


            bible:

                BibleApp.currentBible,


            book:

                BibleApp.currentBook,


            chapter:

                chapterId


        });



    window.location.href =

        `leitor.html?${params.toString()}`;


}



/*=====================================================
OBTER LIVRO ACTUAL
======================================================*/


function getCurrentBook(){


    return BibleApp.books.find(

        book =>

        book.id ===

        BibleApp.currentBook

    );


}

/*=====================================================
                BÍBLIA MHD
                biblia.js
                PARTE 3/5
======================================================*/


/*=====================================================
CONFIGURAR PESQUISA
======================================================*/


function configureSearch(){


    if(!elements.searchForm)

        return;



    elements.searchForm.addEventListener(

        "submit",

        async function(event){


            event.preventDefault();



            const query =

                elements.searchInput.value.trim();



            if(query===""){


                showError(

                    "Digite uma palavra para pesquisar."

                );


                return;


            }



            await performSearch(query);



        }

    );



    if(elements.searchInput){


        elements.searchInput.addEventListener(

            "keydown",

            function(event){


                if(event.key==="Enter"){


                    event.preventDefault();



                    elements.searchForm.requestSubmit();


                }


            }

        );


    }


}



/*=====================================================
PESQUISAR NA BÍBLIA
======================================================*/


async function performSearch(query){


    try{


        hideError();


        showLoader();


        clearResults();



        const response =

            await searchBible(

                query,

                BibleApp.currentBible

            );



        displaySearchResults(

            response.data

        );


    }


    catch(error){


        console.error(

            "Erro pesquisa:",

            error

        );



        showError(

            "Não foi possível pesquisar."

        );


    }


    finally{


        hideLoader();


    }


}



/*=====================================================
MOSTRAR RESULTADOS DA PESQUISA
======================================================*/


function displaySearchResults(data){


    clearResults();



    if(

        !data ||

        !data.verses ||

        data.verses.length===0

    ){


        setResults(`


            <div class="text-center">


                <h3>

                    Nenhum resultado encontrado.

                </h3>


            </div>


        `);



        return;


    }



    let html="";



    data.verses.forEach(verse=>{


        html += createResultCard(verse);


    });



    setResults(html);



    configureResultButtons();


}



/*=====================================================
CRIAR RESULTADO
======================================================*/


function createResultCard(verse){


    return `


        <article class="search-card">


            <h3>

                ${verse.reference}

            </h3>



            <p>

                ${verse.text || ""}

            </p>



            <button

                class="open-result btn-primary"

                data-id="${verse.chapterId}"

            >

                Ler capítulo

            </button>


        </article>


    `;


}



/*=====================================================
ABRIR RESULTADO DA PESQUISA
======================================================*/


function configureResultButtons(){


    document

    .querySelectorAll(

        ".open-result"

    )

    .forEach(button=>{


        button.addEventListener(

            "click",

            ()=>{


                const chapterId =

                    button.dataset.id;



                openChapter(

                    chapterId

                );


            }

        );


    });


}



/*=====================================================
LIMPAR PESQUISA
======================================================*/


function clearSearch(){


    if(elements.searchInput){


        elements.searchInput.value="";


    }



    clearResults();


}



/*=====================================================
TECLA ESC
======================================================*/


document.addEventListener(

    "keydown",

    function(event){


        if(event.key==="Escape"){


            clearSearch();


        }


    }

);

/*=====================================================
                BÍBLIA MHD
                biblia.js
                PARTE 4/5
======================================================*/


/*=====================================================
ABRIR LEITOR
======================================================*/


function openReader(bookId, chapterId){


    saveHistory(

        bookId,

        chapterId

    );



    const params =

        new URLSearchParams({


            bible:

                BibleApp.currentBible,


            book:

                bookId,


            chapter:

                chapterId


        });



    window.location.href =

        `leitor.html?${params.toString()}`;


}



/*=====================================================
HISTÓRICO DE LEITURA
======================================================*/


function saveHistory(bookId, chapterId){


    let history = JSON.parse(

        localStorage.getItem(

            "mhd_history"

        )

        ||

        "[]"

    );



    const item = {


        bible:

            BibleApp.currentBible,


        book:

            bookId,


        chapter:

            chapterId,


        date:

            new Date().toISOString()


    };



    history = history.filter(entry=>{


        return !(


            entry.bible === item.bible

            &&

            entry.book === item.book

            &&

            entry.chapter === item.chapter


        );


    });



    history.unshift(item);



    localStorage.setItem(

        "mhd_history",

        JSON.stringify(

            history.slice(0,50)

        )

    );


}



/*=====================================================
ALTERAR TRADUÇÃO
======================================================*/


async function updateBibleTranslation(bibleId){


    try{


        showLoader();



        BibleApp.currentBible = bibleId;



        localStorage.setItem(

            "mhd_bible",

            bibleId

        );



        await loadBooks();



        clearResults();



    }


    catch(error){


        console.error(error);



        showError(

            "Erro ao mudar tradução."

        );


    }


    finally{


        hideLoader();


    }


}



/*=====================================================
OBTER LIVRO PELO ID
======================================================*/


function getBook(bookId){


    return BibleApp.books.find(

        book =>

        book.id === bookId

    )

    ||

    null;


}



/*=====================================================
GERAR URL DO LEITOR
======================================================*/


function generateReaderURL(bookId,chapterId){


    const params =

        new URLSearchParams({


            bible:

                BibleApp.currentBible,


            book:

                bookId,


            chapter:

                chapterId


        });



    return `leitor.html?${params.toString()}`;


}



/*=====================================================
NOME DO LIVRO
======================================================*/


function getBookName(bookId){


    const book =

        getBook(bookId);



    return book ?

        book.name :

        "";

}



/*=====================================================
VERIFICAR ESTADO
======================================================*/


function isInitialized(){


    return BibleApp.initialized;


}

/*=====================================================
                BÍBLIA MHD
                biblia.js
                PARTE 5/5
======================================================*/


/*=====================================================
RESET DA APLICAÇÃO
======================================================*/


function resetApplication(){


    BibleApp.currentBook = null;


    clearSearch();


    clearResults();


    hideError();


}



/*=====================================================
DEBUG
======================================================*/


function debugBible(){


    console.table({


        Biblia:

            BibleApp.currentBible,


        LivroAtual:

            BibleApp.currentBook,


        TotalLivros:

            BibleApp.books.length,


        Inicializada:

            BibleApp.initialized



    });


}



/*=====================================================
EXPORTAR FUNÇÕES
======================================================*/


window.BibleApp = BibleApp;


window.openBook = openBook;


window.openChapter = openChapter;


window.openReader = openReader;


window.performSearch = performSearch;


window.updateBibleTranslation =

    updateBibleTranslation;


window.debugBible = debugBible;



/*=====================================================
MENSAGEM FINAL
======================================================*/


console.log(

    "✅ Bíblia MHD pronta."

);
