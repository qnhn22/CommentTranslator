chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === 'translateComments') {
    const selectedLanguage = request.language || 'en'; // Default to English if no language is specified
    await translateComments(selectedLanguage);
  }
});

async function detectLanguage(content) {
  const url = 'https://fast-and-highly-accurate-language-detection.p.rapidapi.com/detect';
  const headers = {
    'content-type': 'application/json',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'fast-and-highly-accurate-language-detection.p.rapidapi.com'
  }
  const requestBody = {
    text: content,
    includePredictions: true
  }
  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.lang;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function translateComment(element, language) {
  const commentContent = element.querySelector('#content-text');
  const content = commentContent.innerText || commentContent.textContent; // retrieve comment's content
  const originLan = await detectLanguage(content);
  // go to next iteration if the original language cannot be detected or 
  // cannot translate to the chosen language.
  if (!originLan) {
    return;
  }
  const url =
    `https://translated-mymemory---translation-memory.p.rapidapi.com/get?
    langpair=${originLan}|${language}&q=${content}`;
  const headers = {
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': 'translated-mymemory---translation-memory.p.rapidapi.com'
  };
  const options = {
    method: 'GET',
    headers: headers
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const translation = document.createElement("div");
    if (!data.responseData) {
      return;
    }
    translation.innerText = data.responseData.translatedText;
    element.appendChild(translation);
  } catch (e) {
    console.log(e);
  }
}

async function translateComments(language) {
  const commentComponents = Array.from(document.getElementsByTagName('ytd-comment-thread-renderer'));
  commentComponents.forEach(async (element) => {
    await translateComment(element, language);
  });
}