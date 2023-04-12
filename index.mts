import React, { useEffect, useRef } from "react";
// @ts-expect-error
import { Parser as HtmlToReactParser } from "html-to-react";
import reactElementToJSXString from "react-element-to-jsx-string";
import { minify } from "html-minifier-terser";
import prettier from "prettier";

const accordionHTML = `
<div
  class="govuk-accordion"
  data-module="govuk-accordion"
  id="accordion-default"
>
  <div class="govuk-accordion__section">
    <div class="govuk-accordion__section-header">
      <h2 class="govuk-accordion__section-heading">
        <span
          class="govuk-accordion__section-button"
          id="accordion-default-heading-1"
        >
          Writing well for the web
        </span>
      </h2>
    </div>
    <div
      id="accordion-default-content-1"
      class="govuk-accordion__section-content"
      aria-labelledby="accordion-default-heading-1"
    >
      <p class="govuk-body">
        This is the content for Writing well for the web.
      </p>
    </div>
  </div>
  <div class="govuk-accordion__section">
    <div class="govuk-accordion__section-header">
      <h2 class="govuk-accordion__section-heading">
        <span
          class="govuk-accordion__section-button"
          id="accordion-default-heading-2"
        >
          Writing well for specialists
        </span>
      </h2>
    </div>
    <div
      id="accordion-default-content-2"
      class="govuk-accordion__section-content"
      aria-labelledby="accordion-default-heading-2"
    >
      <p class="govuk-body">
        This is the content for Writing well for specialists.
      </p>
    </div>
  </div>
</div>
`;

// Stop unwanted explicit spaces being added to the output JSX
const minifiedAccordionHTML = await minify(accordionHTML, {
  collapseWhitespace: true,
});

const htmlToReactParser = new HtmlToReactParser();
const reactElement = htmlToReactParser.parse(minifiedAccordionHTML.trim());

// @ts-expect-error
const jsx = reactElementToJSXString.default(
  React.cloneElement(reactElement, { ref: () => {} }),
  { filterProps: ["key"], functionValue: () => "ref" }
);

// ComponentName and useMODUKComponent could be added to MOD.UK Frontend
// and imported from there
type ComponentName = 'Accordion' | 'Header';

// This would also need to accept options that are passed to the
// component constructor
function useMODUKComponent(componentName: ComponentName) {
  const ref = useRef<HTMLDivElement>(null);
  const previousRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Initialise the component if and only if the DOM element has changed
    if (ref.current && ref.current !== previousRef.current) {
      const client = require("@moduk/frontend/client");

      new client[componentName](ref.current).init();
      previousRef.current = ref.current;
    }
  });

  return { ref };
}

const codeSnippet = `
import { useEffect, useRef } from "react";

import { ComponentName, useMODUKComponent } from "@moduk/frontend/react"; 

function Example() {
  const { ref } = useMODUKComponent('Accordion');
  
  return (${jsx});
}
`;

console.log(prettier.format(codeSnippet, { parser: "typescript" }));
