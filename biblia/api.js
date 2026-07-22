// =====================================================
// MHD - API.Bible
// Comunicação com a API.Bible
// =====================================================

/**
 * Executa um pedido à API.Bible.
 * @param {string} endpoint Endpoint da API.
 * @returns {Promise<Object>}
 */
async function apiRequest(endpoint) {

    const url = CONFIG.API_BASE_URL + endpoint;

    console.log("PEDIDO API:", url);

    const response = await fetch(url, {

        headers: {

            "api-key": CONFIG.API_KEY,

            "Accept": "application/json"

        }

    });


    console.log("STATUS API:", response.status);


    if(!response.ok){

        const error = await response.text();

        console.log("ERRO API:", error);

        throw new Error(
            `Erro ${response.status}`
        );

    }


    return await response.json();

}

// =====================================================
// LIVROS
// =====================================================

/**
 * Obtém todos os livros da Bíblia.
 */
async function getBooks(bibleId = CONFIG.DEFAULT_BIBLE) {

    return apiRequest(`/bibles/${bibleId}/books`);

}

/**
 * Obtém informações de um livro.
 */
async function getBook(bookId, bibleId = CONFIG.DEFAULT_BIBLE) {

    return apiRequest(`/bibles/${bibleId}/books/${bookId}`);

}

// =====================================================
// CAPÍTULOS
// =====================================================

/**
 * Obtém todos os capítulos de um livro.
 */
async function getChapters(bookId, bibleId = CONFIG.DEFAULT_BIBLE) {

    return apiRequest(`/bibles/${bibleId}/books/${bookId}/chapters`);

}

/**
 * Obtém o conteúdo de um capítulo.
 */
async function getChapter(chapterId, bibleId = CONFIG.DEFAULT_BIBLE) {

    return apiRequest(`/bibles/${bibleId}/chapters/${chapterId}`);

}

// =====================================================
// VERSÍCULOS
// =====================================================

/**
 * Obtém todos os versículos de um capítulo.
 */
async function getVerses(chapterId, bibleId = CONFIG.DEFAULT_BIBLE) {

    return apiRequest(`/bibles/${bibleId}/chapters/${chapterId}/verses`);

}

/**
 * Obtém um versículo específico.
 */
async function getVerse(verseId, bibleId = CONFIG.DEFAULT_BIBLE) {

    return apiRequest(`/bibles/${bibleId}/verses/${verseId}`);

}

// =====================================================
// PESQUISA
// =====================================================

/**
 * Pesquisa palavras na Bíblia.
 */
async function searchBible(texto, bibleId = CONFIG.DEFAULT_BIBLE) {

    return apiRequest(
        `/bibles/${bibleId}/search?query=${encodeURIComponent(texto)}`
    );

}