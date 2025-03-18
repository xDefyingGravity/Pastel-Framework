import { marked } from 'marked'

const routes: Record<'index.html', ReturnType<typeof Bun.file>> = {
  'index.html': Bun.file('docs/index.md'),
}

const template = (content: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
     <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/gh/PrismJS/prism-themes@master/themes/prism-dracula.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.js"></script>
        <title>Markdown Page</title>
        <style>
          body {
               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
               background-color: #f0f2f5;
               color: #333;
               margin: 0;
               padding: 0;
               line-height: 1.6;
           }

           .markdown-container {
               max-width: 800px;
               margin: 40px auto;
               background-color: #ffffff;
               padding: 40px;
               border-radius: 12px;
               box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
               transition: transform 0.3s ease-in-out;
           }

           .markdown-container:hover {
               transform: translateY(-5px);
           }

           h1 {
               font-size: 2.5rem;
               font-weight: 700;
               color: #2a2e33;
               margin-bottom: 20px;
               padding-bottom: 10px;
           }

           h2 {
               font-size: 2rem;
               font-weight: 600;
               color: #2a2e33;
               margin-top: 30px;
               margin-bottom: 15px;
           }

           h3 {
               font-size: 1.5rem;
               font-weight: 500;
               color: #2a2e33;
               margin-top: 20px;
           }

           p {
               font-size: 1.125rem;
               color: #555;
               margin-bottom: 20px;
               line-height: 1.8;
           }

           a {
               color: #4f7af8;
               text-decoration: none;
               font-weight: 500;
               transition: color 0.3s ease;
           }

           a:hover {
               color: #2d60c4;
           }

           code {
               background-color: #f7f7f7;
               padding: 6px 8px;
               border-radius: 5px;
               font-size: 1rem;
               color: #d14e4e;
               font-family: 'Courier New', Courier, monospace;
           }

           pre {
               background-color: #2e2e2e;
               color: #f7f7f7;
               padding: 20px;
               border-radius: 10px;
               overflow-x: auto;
               font-size: 1rem;
               font-family: 'Courier New', Courier, monospace;
           }

           blockquote {
               background-color: #f7f7f7;
               border-left: 5px solid #4f7af8;
               padding: 15px 20px;
               margin: 20px 0;
               font-style: italic;
               color: #666;
           }

           ul, ol {
               margin-left: 20px;
               margin-bottom: 20px;
           }

           li {
               font-size: 1.125rem;
               color: #444;
               line-height: 1.7;
           }

           img {
               max-width: 100%;
               border-radius: 8px;
           }

           hr {
               border: none;
               height: 2px;
               background-color: #dfe3e8;
               margin: 10px 0;
               border-radius: 10px;
           }

           .up-next-links {
               display: flex;
               gap: 20px;
               flex-wrap: wrap;
               justify-content: flex-start;
               margin-top: 10px;
           }

           .up-next-links a {
               font-size: 1.125rem;
               font-weight: 500;
               color: #4f7af8;
               text-decoration: none;
               background-color: #f0f4ff;
               padding: 12px 20px;
               border-radius: 8px;
               border: 2px solid #4f7af8;
               transition: all 0.3s ease;
               display: inline-block;
           }

           .up-next-links a:hover {
               background-color: #4f7af8;
               color: white;
               transform: translateY(-3px);
               box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
           }

           .up-next-links a:active {
               transform: translateY(1px);
           }

           .up-next-links a:focus {
               outline: none;
               border-color: #2d60c4;
               box-shadow: 0 0 0 3px rgba(45, 96, 196, 0.3);
           }
        </style>
     </head>
     <body>
        <div class="markdown-container">
          ${content}
        </div>
     </body>
  </html>`;
}

const renderPage = async (route: string) => {
  try {
    const markdownFile = routes[route as keyof typeof routes];
    if (!markdownFile) {
      throw new Error(`Route for ${route} not found`);
    }

    const markdownContent = await markdownFile.text();

    const htmlContent = marked(markdownContent);

    return template(htmlContent as string);
  } catch (error) {
    console.error('[error]', error);
    return `<h1>Error loading the page</h1>`;
  }
}

for (const [output] of Object.entries(routes)) {
  await Bun.write("docs/site/" + output, await renderPage(output));
}
