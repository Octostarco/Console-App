export const getAllGlobalProperties = () => {
  const globalObjects = [
    ...Object.getOwnPropertyNames(window),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf({})),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf([])),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(Function)),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(Math)),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(JSON)),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(new Date())),
    ...Object.getOwnPropertyNames(Object.getPrototypeOf(/regex/)),
  ];
  const DesktopAPIMethods = [
    'addComment',
    'addToFocusList',
    'addWatchIntent',
    'applyTag',
    'callAppService',
    'clearToast',
    'closeTab',
    'closeWorkspace',
    'connect',
    'copy',
    'createWorkspace',
    'delete',
    'delete_local_concept_records',
    'delete_workspace_records',
    'deployApp',
    'export',
    'getActiveWorkspace',
    'getAttachment',
    'getAvailableTags',
    'getFilesTree',
    'getFocusList',
    'getImages',
    'getItem',
    'getItems',
    'getJSONSchema',
    'getOpenWorkspaces',
    'getPasteContext',
    'getSchemaItems',
    'getStyler',
    'getStylerOptions',
    'getTags',
    'getTemplate',
    'getTemplates',
    'getUser',
    'getWorkspace',
    'getWorkspaceItems',
    'getWorkspacePermission',
    'import',
    'importZip',
    'internalGetIconCode',
    'listAllWorkspaces',
    'open',
    'openWorkspace',
    'refresh',
    'removeFromFocusList',
    'removeTag',
    'removeWatchIntent',
    'save',
    'saveFile',
    'searchXperience',
    'setActiveWorkspace',
    'showConfirm',
    'showContextMenu',
    'showCreateEntityForm',
    'showCreateRelationsDialog',
    'showFileUpload',
    'showModalTemplate',
    'showProgress',
    'showSaveAsModal',
    'showTab',
    'showToast',
    'undeployApp',
    'updateTag',
    'whoami',
    'withProgressBar',
  ].map((m) => `DesktopAPI.${m}(`);
  const OntologyAPImethods = [
    'cancelQueries',
    'clearRelationshipCache',
    'consistentUUID',
    'getAvailableOntologies',
    'getConceptByName',
    'getConceptForEntity',
    'getConcepts',
    'getConnectedEntities',
    'getEntity',
    'getOntologyName',
    'getRelationshipCount',
    'getRelationshipsForEntity',
    'getSysInheritance',
    'getWorkspaceRelationshipRecords',
    'sendQuery',
    'sendQueryT',
    'subscribe',
    'updateCache',
  ].map((m) => `OntologyAPI.${m}(`);

  const all = Array.from(
    new Set([...DesktopAPIMethods, ...OntologyAPImethods, ...globalObjects])
  );
  return all;
};

export const moveCursorToEnd = (element: HTMLElement | null) => {
  if (!element) return;

  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  sel?.removeAllRanges();
  sel?.addRange(range);
};
