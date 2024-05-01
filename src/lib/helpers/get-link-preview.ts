import axios from 'axios';
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

interface LinkPreview {
  title: string;
  description: string;
  image: string;
}

export default async function getLinkPreview(
  url: string
): Promise<LinkPreview> {
  try {
    // Fetch HTML content of the URL
    const response = await axios.get(url);
    const html = response.data;

    // Parse HTML using JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Extract OpenGraph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    const ogImage = document.querySelector('meta[property="og:image"]');

    // Construct link preview object
    const linkPreview: LinkPreview = {
      title: ogTitle ? ogTitle.getAttribute('content') || '' : '',
      description: ogDescription
        ? ogDescription.getAttribute('content') || ''
        : '',
      image: ogImage ? ogImage.getAttribute('content') || '' : '',
    };

    // Fallback: If both title and description are empty, extract from page content
    if (!linkPreview.title || !linkPreview.description) {
      linkPreview.title = extractTitle(document);
      linkPreview.description = extractDescription(document);
    }

    return linkPreview;
  } catch (error) {
    console.error('Error fetching link preview:', error);
    throw error;
  }
}

function extractTitle(document: Document): string {
  const titleElement = document.querySelector('h1, h2, h3, h4, h5, h6');
  return titleElement ? titleElement.textContent || '' : '';
}

function extractDescription(document: Document): string {
  const descriptionElement = document.querySelector('p, div');
  return descriptionElement ? descriptionElement.textContent || '' : '';
}
