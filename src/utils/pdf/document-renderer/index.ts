
import { renderDocumentContent } from './contentRenderer';
import { parseHtmlContent, ParsedHtmlContent } from './htmlParser';
import { paginateContent, createPdfFilename } from './pagination';
import { PdfRenderingOptions, DocumentContent } from './types';
import { renderHeader } from './headerRenderer';
import { renderFooter } from './footerRenderer';
import { renderPageContent } from './pageContentRenderer';
import { renderText, getTextWidth, createLinkAnnotation } from './renderers/textRenderer';
import { renderItemsList } from './renderers/itemRenderer';
import { renderHeading, renderParagraph } from './renderers/categoryRenderer';

export {
  renderDocumentContent,
  parseHtmlContent,
  paginateContent,
  createPdfFilename,
  renderHeader,
  renderFooter,
  renderPageContent,
  renderText,
  getTextWidth,
  createLinkAnnotation,
  renderItemsList,
  renderHeading,
  renderParagraph
};

export type {
  PdfRenderingOptions,
  ParsedHtmlContent,
  DocumentContent
};
