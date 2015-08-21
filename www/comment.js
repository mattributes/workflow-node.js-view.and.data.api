/**
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   2.1.1
 */

(function(){"use strict";if(self.Promise)return;function lib$es6$promise$utils$$objectOrFunction(x){return typeof x==="function"||typeof x==="object"&&x!==null}function lib$es6$promise$utils$$isFunction(x){return typeof x==="function"}function lib$es6$promise$utils$$isMaybeThenable(x){return typeof x==="object"&&x!==null}var lib$es6$promise$utils$$_isArray;if(!Array.isArray){lib$es6$promise$utils$$_isArray=function(x){return Object.prototype.toString.call(x)==="[object Array]"}}else{lib$es6$promise$utils$$_isArray=Array.isArray}var lib$es6$promise$utils$$isArray=lib$es6$promise$utils$$_isArray;var lib$es6$promise$asap$$len=0;var lib$es6$promise$asap$$toString={}.toString;var lib$es6$promise$asap$$vertxNext;function lib$es6$promise$asap$$asap(callback,arg){lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len]=callback;lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len+1]=arg;lib$es6$promise$asap$$len+=2;if(lib$es6$promise$asap$$len===2){lib$es6$promise$asap$$scheduleFlush()}}var lib$es6$promise$asap$$default=lib$es6$promise$asap$$asap;var lib$es6$promise$asap$$browserWindow=typeof window!=="undefined"?window:undefined;var lib$es6$promise$asap$$browserGlobal=lib$es6$promise$asap$$browserWindow||{};var lib$es6$promise$asap$$BrowserMutationObserver=lib$es6$promise$asap$$browserGlobal.MutationObserver||lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;var lib$es6$promise$asap$$isNode=typeof process!=="undefined"&&{}.toString.call(process)==="[object process]";var lib$es6$promise$asap$$isWorker=typeof Uint8ClampedArray!=="undefined"&&typeof importScripts!=="undefined"&&typeof MessageChannel!=="undefined";function lib$es6$promise$asap$$useNextTick(){var nextTick=process.nextTick;var version=process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);if(Array.isArray(version)&&version[1]==="0"&&version[2]==="10"){nextTick=setImmediate}return function(){nextTick(lib$es6$promise$asap$$flush)}}function lib$es6$promise$asap$$useVertxTimer(){return function(){lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush)}}function lib$es6$promise$asap$$useMutationObserver(){var iterations=0;var observer=new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);var node=document.createTextNode("");observer.observe(node,{characterData:true});return function(){node.data=iterations=++iterations%2}}function lib$es6$promise$asap$$useMessageChannel(){var channel=new MessageChannel;channel.port1.onmessage=lib$es6$promise$asap$$flush;return function(){channel.port2.postMessage(0)}}function lib$es6$promise$asap$$useSetTimeout(){return function(){setTimeout(lib$es6$promise$asap$$flush,1)}}var lib$es6$promise$asap$$queue=new Array(1e3);function lib$es6$promise$asap$$flush(){for(var i=0;i<lib$es6$promise$asap$$len;i+=2){var callback=lib$es6$promise$asap$$queue[i];var arg=lib$es6$promise$asap$$queue[i+1];callback(arg);lib$es6$promise$asap$$queue[i]=undefined;lib$es6$promise$asap$$queue[i+1]=undefined}lib$es6$promise$asap$$len=0}function lib$es6$promise$asap$$attemptVertex(){try{var r=require;var vertx=r("vertx");lib$es6$promise$asap$$vertxNext=vertx.runOnLoop||vertx.runOnContext;return lib$es6$promise$asap$$useVertxTimer()}catch(e){return lib$es6$promise$asap$$useSetTimeout()}}var lib$es6$promise$asap$$scheduleFlush;if(lib$es6$promise$asap$$isNode){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useNextTick()}else if(lib$es6$promise$asap$$BrowserMutationObserver){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMutationObserver()}else if(lib$es6$promise$asap$$isWorker){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useMessageChannel()}else if(lib$es6$promise$asap$$browserWindow===undefined&&typeof require==="function"){lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$attemptVertex()}else{lib$es6$promise$asap$$scheduleFlush=lib$es6$promise$asap$$useSetTimeout()}function lib$es6$promise$$internal$$noop(){}var lib$es6$promise$$internal$$PENDING=void 0;var lib$es6$promise$$internal$$FULFILLED=1;var lib$es6$promise$$internal$$REJECTED=2;var lib$es6$promise$$internal$$GET_THEN_ERROR=new lib$es6$promise$$internal$$ErrorObject;function lib$es6$promise$$internal$$selfFullfillment(){return new TypeError("You cannot resolve a promise with itself")}function lib$es6$promise$$internal$$cannotReturnOwn(){return new TypeError("A promises callback cannot return that same promise.")}function lib$es6$promise$$internal$$getThen(promise){try{return promise.then}catch(error){lib$es6$promise$$internal$$GET_THEN_ERROR.error=error;return lib$es6$promise$$internal$$GET_THEN_ERROR}}function lib$es6$promise$$internal$$tryThen(then,value,fulfillmentHandler,rejectionHandler){try{then.call(value,fulfillmentHandler,rejectionHandler)}catch(e){return e}}function lib$es6$promise$$internal$$handleForeignThenable(promise,thenable,then){lib$es6$promise$asap$$default(function(promise){var sealed=false;var error=lib$es6$promise$$internal$$tryThen(then,thenable,function(value){if(sealed){return}sealed=true;if(thenable!==value){lib$es6$promise$$internal$$resolve(promise,value)}else{lib$es6$promise$$internal$$fulfill(promise,value)}},function(reason){if(sealed){return}sealed=true;lib$es6$promise$$internal$$reject(promise,reason)},"Settle: "+(promise._label||" unknown promise"));if(!sealed&&error){sealed=true;lib$es6$promise$$internal$$reject(promise,error)}},promise)}function lib$es6$promise$$internal$$handleOwnThenable(promise,thenable){if(thenable._state===lib$es6$promise$$internal$$FULFILLED){lib$es6$promise$$internal$$fulfill(promise,thenable._result)}else if(thenable._state===lib$es6$promise$$internal$$REJECTED){lib$es6$promise$$internal$$reject(promise,thenable._result)}else{lib$es6$promise$$internal$$subscribe(thenable,undefined,function(value){lib$es6$promise$$internal$$resolve(promise,value)},function(reason){lib$es6$promise$$internal$$reject(promise,reason)})}}function lib$es6$promise$$internal$$handleMaybeThenable(promise,maybeThenable){if(maybeThenable.constructor===promise.constructor){lib$es6$promise$$internal$$handleOwnThenable(promise,maybeThenable)}else{var then=lib$es6$promise$$internal$$getThen(maybeThenable);if(then===lib$es6$promise$$internal$$GET_THEN_ERROR){lib$es6$promise$$internal$$reject(promise,lib$es6$promise$$internal$$GET_THEN_ERROR.error)}else if(then===undefined){lib$es6$promise$$internal$$fulfill(promise,maybeThenable)}else if(lib$es6$promise$utils$$isFunction(then)){lib$es6$promise$$internal$$handleForeignThenable(promise,maybeThenable,then)}else{lib$es6$promise$$internal$$fulfill(promise,maybeThenable)}}}function lib$es6$promise$$internal$$resolve(promise,value){if(promise===value){lib$es6$promise$$internal$$reject(promise,lib$es6$promise$$internal$$selfFullfillment())}else if(lib$es6$promise$utils$$objectOrFunction(value)){lib$es6$promise$$internal$$handleMaybeThenable(promise,value)}else{lib$es6$promise$$internal$$fulfill(promise,value)}}function lib$es6$promise$$internal$$publishRejection(promise){if(promise._onerror){promise._onerror(promise._result)}lib$es6$promise$$internal$$publish(promise)}function lib$es6$promise$$internal$$fulfill(promise,value){if(promise._state!==lib$es6$promise$$internal$$PENDING){return}promise._result=value;promise._state=lib$es6$promise$$internal$$FULFILLED;if(promise._subscribers.length!==0){lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish,promise)}}function lib$es6$promise$$internal$$reject(promise,reason){if(promise._state!==lib$es6$promise$$internal$$PENDING){return}promise._state=lib$es6$promise$$internal$$REJECTED;promise._result=reason;lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publishRejection,promise)}function lib$es6$promise$$internal$$subscribe(parent,child,onFulfillment,onRejection){var subscribers=parent._subscribers;var length=subscribers.length;parent._onerror=null;subscribers[length]=child;subscribers[length+lib$es6$promise$$internal$$FULFILLED]=onFulfillment;subscribers[length+lib$es6$promise$$internal$$REJECTED]=onRejection;if(length===0&&parent._state){lib$es6$promise$asap$$default(lib$es6$promise$$internal$$publish,parent)}}function lib$es6$promise$$internal$$publish(promise){var subscribers=promise._subscribers;var settled=promise._state;if(subscribers.length===0){return}var child,callback,detail=promise._result;for(var i=0;i<subscribers.length;i+=3){child=subscribers[i];callback=subscribers[i+settled];if(child){lib$es6$promise$$internal$$invokeCallback(settled,child,callback,detail)}else{callback(detail)}}promise._subscribers.length=0}function lib$es6$promise$$internal$$ErrorObject(){this.error=null}var lib$es6$promise$$internal$$TRY_CATCH_ERROR=new lib$es6$promise$$internal$$ErrorObject;function lib$es6$promise$$internal$$tryCatch(callback,detail){try{return callback(detail)}catch(e){lib$es6$promise$$internal$$TRY_CATCH_ERROR.error=e;return lib$es6$promise$$internal$$TRY_CATCH_ERROR}}function lib$es6$promise$$internal$$invokeCallback(settled,promise,callback,detail){var hasCallback=lib$es6$promise$utils$$isFunction(callback),value,error,succeeded,failed;if(hasCallback){value=lib$es6$promise$$internal$$tryCatch(callback,detail);if(value===lib$es6$promise$$internal$$TRY_CATCH_ERROR){failed=true;error=value.error;value=null}else{succeeded=true}if(promise===value){lib$es6$promise$$internal$$reject(promise,lib$es6$promise$$internal$$cannotReturnOwn());return}}else{value=detail;succeeded=true}if(promise._state!==lib$es6$promise$$internal$$PENDING){}else if(hasCallback&&succeeded){lib$es6$promise$$internal$$resolve(promise,value)}else if(failed){lib$es6$promise$$internal$$reject(promise,error)}else if(settled===lib$es6$promise$$internal$$FULFILLED){lib$es6$promise$$internal$$fulfill(promise,value)}else if(settled===lib$es6$promise$$internal$$REJECTED){lib$es6$promise$$internal$$reject(promise,value)}}function lib$es6$promise$$internal$$initializePromise(promise,resolver){try{resolver(function resolvePromise(value){lib$es6$promise$$internal$$resolve(promise,value)},function rejectPromise(reason){lib$es6$promise$$internal$$reject(promise,reason)})}catch(e){lib$es6$promise$$internal$$reject(promise,e)}}function lib$es6$promise$enumerator$$Enumerator(Constructor,input){var enumerator=this;enumerator._instanceConstructor=Constructor;enumerator.promise=new Constructor(lib$es6$promise$$internal$$noop);if(enumerator._validateInput(input)){enumerator._input=input;enumerator.length=input.length;enumerator._remaining=input.length;enumerator._init();if(enumerator.length===0){lib$es6$promise$$internal$$fulfill(enumerator.promise,enumerator._result)}else{enumerator.length=enumerator.length||0;enumerator._enumerate();if(enumerator._remaining===0){lib$es6$promise$$internal$$fulfill(enumerator.promise,enumerator._result)}}}else{lib$es6$promise$$internal$$reject(enumerator.promise,enumerator._validationError())}}lib$es6$promise$enumerator$$Enumerator.prototype._validateInput=function(input){return lib$es6$promise$utils$$isArray(input)};lib$es6$promise$enumerator$$Enumerator.prototype._validationError=function(){return new Error("Array Methods must be provided an Array")};lib$es6$promise$enumerator$$Enumerator.prototype._init=function(){this._result=new Array(this.length)};var lib$es6$promise$enumerator$$default=lib$es6$promise$enumerator$$Enumerator;lib$es6$promise$enumerator$$Enumerator.prototype._enumerate=function(){var enumerator=this;var length=enumerator.length;var promise=enumerator.promise;var input=enumerator._input;for(var i=0;promise._state===lib$es6$promise$$internal$$PENDING&&i<length;i++){enumerator._eachEntry(input[i],i)}};lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry=function(entry,i){var enumerator=this;var c=enumerator._instanceConstructor;if(lib$es6$promise$utils$$isMaybeThenable(entry)){if(entry.constructor===c&&entry._state!==lib$es6$promise$$internal$$PENDING){entry._onerror=null;enumerator._settledAt(entry._state,i,entry._result)}else{enumerator._willSettleAt(c.resolve(entry),i)}}else{enumerator._remaining--;enumerator._result[i]=entry}};lib$es6$promise$enumerator$$Enumerator.prototype._settledAt=function(state,i,value){var enumerator=this;var promise=enumerator.promise;if(promise._state===lib$es6$promise$$internal$$PENDING){enumerator._remaining--;if(state===lib$es6$promise$$internal$$REJECTED){lib$es6$promise$$internal$$reject(promise,value)}else{enumerator._result[i]=value}}if(enumerator._remaining===0){lib$es6$promise$$internal$$fulfill(promise,enumerator._result)}};lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt=function(promise,i){var enumerator=this;lib$es6$promise$$internal$$subscribe(promise,undefined,function(value){enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED,i,value)},function(reason){enumerator._settledAt(lib$es6$promise$$internal$$REJECTED,i,reason)})};function lib$es6$promise$promise$all$$all(entries){return new lib$es6$promise$enumerator$$default(this,entries).promise}var lib$es6$promise$promise$all$$default=lib$es6$promise$promise$all$$all;function lib$es6$promise$promise$race$$race(entries){var Constructor=this;var promise=new Constructor(lib$es6$promise$$internal$$noop);if(!lib$es6$promise$utils$$isArray(entries)){lib$es6$promise$$internal$$reject(promise,new TypeError("You must pass an array to race."));return promise}var length=entries.length;function onFulfillment(value){lib$es6$promise$$internal$$resolve(promise,value)}function onRejection(reason){lib$es6$promise$$internal$$reject(promise,reason)}for(var i=0;promise._state===lib$es6$promise$$internal$$PENDING&&i<length;i++){lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]),undefined,onFulfillment,onRejection)}return promise}var lib$es6$promise$promise$race$$default=lib$es6$promise$promise$race$$race;function lib$es6$promise$promise$resolve$$resolve(object){var Constructor=this;if(object&&typeof object==="object"&&object.constructor===Constructor){return object}var promise=new Constructor(lib$es6$promise$$internal$$noop);lib$es6$promise$$internal$$resolve(promise,object);return promise}var lib$es6$promise$promise$resolve$$default=lib$es6$promise$promise$resolve$$resolve;function lib$es6$promise$promise$reject$$reject(reason){var Constructor=this;var promise=new Constructor(lib$es6$promise$$internal$$noop);lib$es6$promise$$internal$$reject(promise,reason);return promise}var lib$es6$promise$promise$reject$$default=lib$es6$promise$promise$reject$$reject;var lib$es6$promise$promise$$counter=0;function lib$es6$promise$promise$$needsResolver(){throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")}function lib$es6$promise$promise$$needsNew(){throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")}var lib$es6$promise$promise$$default=lib$es6$promise$promise$$Promise;function lib$es6$promise$promise$$Promise(resolver){this._id=lib$es6$promise$promise$$counter++;this._state=undefined;this._result=undefined;this._subscribers=[];if(lib$es6$promise$$internal$$noop!==resolver){if(!lib$es6$promise$utils$$isFunction(resolver)){lib$es6$promise$promise$$needsResolver()}if(!(this instanceof lib$es6$promise$promise$$Promise)){lib$es6$promise$promise$$needsNew()}lib$es6$promise$$internal$$initializePromise(this,resolver)}}lib$es6$promise$promise$$Promise.all=lib$es6$promise$promise$all$$default;lib$es6$promise$promise$$Promise.race=lib$es6$promise$promise$race$$default;lib$es6$promise$promise$$Promise.resolve=lib$es6$promise$promise$resolve$$default;lib$es6$promise$promise$$Promise.reject=lib$es6$promise$promise$reject$$default;lib$es6$promise$promise$$Promise.prototype={constructor:lib$es6$promise$promise$$Promise,then:function(onFulfillment,onRejection){var parent=this;var state=parent._state;if(state===lib$es6$promise$$internal$$FULFILLED&&!onFulfillment||state===lib$es6$promise$$internal$$REJECTED&&!onRejection){return this}var child=new this.constructor(lib$es6$promise$$internal$$noop);var result=parent._result;if(state){var callback=arguments[state-1];lib$es6$promise$asap$$default(function(){lib$es6$promise$$internal$$invokeCallback(state,child,callback,result)})}else{lib$es6$promise$$internal$$subscribe(parent,child,onFulfillment,onRejection)}return child},"catch":function(onRejection){return this.then(null,onRejection)}};function lib$es6$promise$polyfill$$polyfill(){var local;if(typeof global!=="undefined"){local=global}else if(typeof self!=="undefined"){local=self}else{try{local=Function("return this")()}catch(e){throw new Error("polyfill failed because global object is unavailable in this environment")}}var P=local.Promise;if(P&&Object.prototype.toString.call(P.resolve())==="[object Promise]"&&!P.cast){return}local.Promise=lib$es6$promise$promise$$default}var lib$es6$promise$polyfill$$default=lib$es6$promise$polyfill$$polyfill;var lib$es6$promise$umd$$ES6Promise={Promise:lib$es6$promise$promise$$default,polyfill:lib$es6$promise$polyfill$$default};if(typeof define==="function"&&define["amd"]){define(function(){return lib$es6$promise$umd$$ES6Promise})}else if(typeof module!=="undefined"&&module["exports"]){module["exports"]=lib$es6$promise$umd$$ES6Promise}else if(typeof this!=="undefined"){this["ES6Promise"]=lib$es6$promise$umd$$ES6Promise}lib$es6$promise$polyfill$$default()}).call(this);
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// TODO: Figure out a better way to solve the fact that AutodeskNamespace may not be defined.
var namespaceFunction;
if (typeof(AutodeskNamespace) === "function") { namespaceFunction = AutodeskNamespace; }
else if (typeof(e2oNamespace) === "function") { namespaceFunction = e2oNamespace; } // A360 support
else {
    namespaceFunction = function (s) {
        var ns = this;

        var parts = s.split('.');
        for (var i = 0; i < parts.length; ++i) {
            ns[parts[i]] = ns[parts[i]] || {};
            ns = ns[parts[i]];
        }

        return ns;
    };
}
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.Constants = {

    JSON_VERSION_DATA: "2.0",

        // Comment sorting
    SORT_OLDER_ON_TOP: 'sort_older_on_top',
    SORT_NEWER_ON_TOP: 'sort_newer_on_top',

        // Comment filtering
    FILTER_VERSION_ANY: 'any',
    FILTER_VERSION_CURRENT: 'current',

        // Framed tools
    FRAMED_TOOL_POINT: 'framed_tool_point',
    FRAMED_TOOL_OBJECT: 'framed_tool_object',

        // Comment status. Associated to appComment['serverStatus']
    COMMENT_STATUS_AUTHORING: 'comment_status_authoring',
    COMMENT_STATUS_WAITING_SERVER_RESPONSE: 'comment_status_waiting_server_response',
    COMMENT_STATUS_SAVED_TO_DB: 'comment_status_saved_to_db',
    COMMENT_STATUS_FAILED_TO_POST: 'comment_status_failed_to_post',

        // Attachment types
    ATTACHMENT_TYPE_SNAPSHOT: 'snapshot',
    ATTACHMENT_TYPE_MARKUP: 'markup',
    ATTACHMENT_TYPE_DOCUMENT: 'document',

        // Attachment OSS data type
    ATTACHMENT_DATA_TYPE_BINARY: 'binary',
    ATTACHMENT_DATA_TYPE_TEXT: 'text',

        // Image capture
    IMAGE_CAPTURE_THUMB_HEIGHT: 74, // pixels

        // XHR Headers
    XHR_HEADER: {
        FORMAT_PNG  : {'name': 'x-ads-extn',            'value': 'png'},
        FORMAT_SVG  : {'name': 'x-ads-extn',            'value': 'svg'},
        NAMESPACE   : {'name': 'x-ads-acm-namespace',   'value': 'GlobantComments'},
        POLICIES    : {'name': 'x-ads-acm-policies',    'value': 'comments-view-dev2'}
    }
};

namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.Localization = {

    // Panel
    add_comment: "Comments",
    post_new_comment: "Add Comment",
    post_new_reply: "Add Reply",
    options: "Options",
    show_comments_on: "Show comments on:",
    all_sheets: "All sheets",
    this_sheet: "Only this sheet",
    all_versions: "All versions",
    this_version: "Only this version",
    sort_comments: "Sort comments by:",
    sort_oldest: "Oldest on top",
    sort_most_recent: "Most recent on top",
    status: "Showing all comments",
    status_this_sheet: "Comments for this sheet",
    status_this_version: "Comments for this version",
    status_this_version_this_sheet: "Comments for this version and sheet",
    default_textarea_message: "Enter a comment. Use @ to mention and alert specific people.",
    default_textarea_reply_message: "Enter a reply. Use @ to mention and alert specific people.",
    enter_reply_message: "Enter a reply",
    confirm_title: "Confirm",
    delete_comment: "Are you sure you want to delete this comment?",
    delete_comment_reply: "Are you sure you want to delete this reply?",
    version_symbol: "V",
    button_ok: "OK",
    button_cancel: "Cancel",
    button_delete: "Delete",
    loading_comments: "Loading comments...",
    object_tooltip: "Comment on an object",
    point_tooltip: "Comment on a point",
    image_capture_tooltip: "Capture an image",
    attachment_tooltip: "Add attachment",
    download_tooltip: "Open screenshot in new tab",
    no_comments: "There are no comments for this item.",
    no_comments_because_filters: "No comments to display. Consider resetting filters.",
    image_capture_label: "Image",
    markups_label: "Viewer Markups",
    unknown_sheet: "Unknown sheet",
    different_version_sheet: "Sheet version mismatch",
    postComment_failure: '[error]',
    postComment_posting: 'posting...',

    // PinTool
    pintool_message: "Click a point on the model to begin commenting.",

    // ObjectSelect Tool
    objectSelect_message: "Click an object on the model to begin commenting.",

    // Markup Action Toolbar
    matbar_create_markup: 'Create Markup',
    matbar_mode_edit_cancel: 'Cancel',
    matbar_mode_edit_info: 'Choose annotation type',
    matbar_mode_edit_done: 'Finish Markup',
    matbar_mode_view_done: 'Done Viewing Markup',
    matbar_mode_view_loading: 'Loading Markup...',

    // Viewer Context Menu
    post_new_comment_context_menu: "Add comment",

    // Viewer's toolbar
    show_markers_tooltip: "Show markers",
    hide_markers_tooltip: "Hide markers"

};

namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.createCommentsApp = function(viewer, parentContainer, settings) {

    // Panels and Server handler
    var mCommentsPanel,
        mCommentsViewer,
        mMarkupsActionBar,
        mServerOperator;

    // Data (Comments and Attachments to be posted)
    var mAppCommentList = [],
        mAppAttachmentsList = [],   // Attachments that require OSS uploading prior to comment posting.
        mSelectedComment = null,
        mHoveredComment = null,
        mViewingApp = null,
        mViewerInstance = null,
        mSheetItem = null,
        mModelExternalIdFetched = {},
        mMaxUIId = 0;

    // Others
    var mbPanelReady = false,
        mbViewerReady = false,
        mbModelLoaded = false,
        mFilters = null,
        mAllowCommentLineUpdate = false,
        mDrawingCommentLine = false,
        mDrawingLinePostNewComment = false,
        mPendingSelectDefaultComment = true,
        mSortStrategy = Autodesk.Comments2.Constants.SORT_NEWER_ON_TOP;

    settings = settings || {}; // Make sure we remove the null case.

    function initialize() {
        var args = {
            viewer: viewer,
            parentContainer: parentContainer,
            settings: settings,
            locStrings: Autodesk.Comments2.Localization
        };

        fixupAcmConstants();

        mCommentsViewer = new Autodesk.Comments2.CommentsViewer(args);
        mCommentsPanel = new Autodesk.Comments2.CommentPanel(args);
        mMarkupsActionBar = new Autodesk.Comments2.MarkupsActionBar(args);

        setDefaultFilter();
        mbPanelReady = false;
        mbViewerReady = false;

        // No need to remove these listeners
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_CHANGE_PANEL_VISIBILITY, onChangeCommentPanelVisibility);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_CLICK_COMMENT_ENTRY, onClickCommentEntry);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT, onRequestNewComment);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT_REPLY, onRequestNewCommentReply);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_REQUEST_SELECT_COMMENT_ENTRY, onRequestSelectCommentEntry);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_REQUEST_DELETE_COMMENT, onRequestDeleteComment);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_REQUEST_DELETE_COMMENT_REPLY, onRequestDeleteCommentReply);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_FILTER_CHANGED_CURRENT_SHEET, onFilterChangedCurrentSheet);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_FILTER_CHANGED_VERSION, onFilterChangedVersion);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_SORT_CHANGED, onSortChanged);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_CLICK_FRAMED_TOOL, onClickFramedTool);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_REMOVE_ATTACHMENT, onAttachmentRemoved);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT, onFetchOssAttachment); // Same for mCommentsViewer
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_ENTER_COMMENT_MARKER, onEnterCommentMarker);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_LEAVE_COMMENT_MARKER, onLeaveCommentMarker);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_FOCUS_CHANGE_NEW_COMMENT, onFocusChangeNewComment);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_SCROLL_COMMENT_ENTRIES, onScrollCommentEntries);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_REQUEST_CHANGE_SHEET, onRequestChangeSheet);
        mCommentsPanel.addEventListener(mCommentsPanel.EVENT_COMMENTS2_REQUEST_SNAPSHOT, onRequestSnapshot);

        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_VIEWER_READY, onViewerReady);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_CLICK_VIEWER_MARKER, onClickViewerMarker);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_ENTER_VIEWER_MARKER, onEnterViewerMarker);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_LEAVE_VIEWER_MARKER, onLeaveViewerMarker);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_REQUEST_CAPTURE_IMAGE, onRequestCaptureImage);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_REQUEST_FOCUS_TO_POST_COMMENT, onRequestFocusToPostComment);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_FRAMED_TOOLS_CANCELED, onFramedToolsCanceled);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_REQUEST_UNSELECT_COMMENT, onRequestUnselectComment);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_REQUEST_CONTEXT_MENU_COMMENT, onRequestContextMenuComment);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT, onFetchOssAttachment); // Same for mCommentsPanel
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_ESCAPE_CREATE_MARKUPS, onEscapeCreateMarkups);
        mCommentsViewer.addEventListener(mCommentsViewer.EVENT_COMMENTS2_MARKUPS_RESTORED, onMarkupsRestored);

        mCommentsViewer.initialize();
        mCommentsPanel.initialize();

        var mab = mMarkupsActionBar;
        mab.addEventListener(mab.EVENT_COMMENTS2_ACTIONBAR_SAVE, onSaveMarkups);
        mab.addEventListener(mab.EVENT_COMMENTS2_ACTIONBAR_ENTER_ANNOTATIONS_EDIT_MODE, onEnterAnnotationsEditMode);
        mab.addEventListener(mab.EVENT_COMMENTS2_ACTIONBAR_CANCEL_ANNOTATIONS_EDIT_MODE, onCancelAnnotationsEditMode);
        mab.addEventListener(mab.EVENT_COMMENTS2_ACTIONBAR_LEAVE_ANNOTATIONS_VIEW_MODE, onLeaveAnnotationsViewMode);
        mab.initialize();

        // Finally, fetch comments from server.
        initServerComm(args);
    }

    function destroy() {
        if (mMarkupsActionBar) {
            mMarkupsActionBar.destroy();
            mMarkupsActionBar = null;
        }
        if (mCommentsPanel) {
            mCommentsPanel.destroy();
            mCommentsPanel = null;
        }
        if (mCommentsViewer) {
            mCommentsViewer.destroy();
            mCommentsViewer = null;
        }
    }

    /**
     * It is unlikely that code in here will execute, but we'll have
     * it anyway JUST IN CASE it becomes a necessity.
     */
    function fixupAcmConstants() {
        if (settings.acm_namespace && settings.acm_policy) {
            Autodesk.Comments2.Constants.XHR_HEADER.NAMESPACE.value = settings.acm_namespace;
            Autodesk.Comments2.Constants.XHR_HEADER.POLICIES.value = settings.acm_policy;
        }
    }

    function setVisible(isVisible) {
        mCommentsPanel.setVisible(isVisible);
    }

    function updateHeight() {
        mCommentsPanel.updateCommentsHeight();
    }

    /**
     * Initializes the filter object
     */
    function setDefaultFilter() {
        mFilters = {
            currentSheetOnly: false,
            version: Autodesk.Comments2.Constants.FILTER_VERSION_ANY
        };
    }

    /**
     * Sets a new token to access the commenting service.
     * Useful since the tokens may expire in minutes/hours.
     * @param {String} token - 3-legged OAuth 2 token to access commenting service.
     */
    function setToken(token) {
        mServerOperator.setToken(token);
        // TODO: Retry failed operations (silently)
    }

    function setViewingApp(viewingApp) {

        mViewingApp = viewingApp;

        // Register listeners
        viewingApp.addItemSelectedObserver(
            {
                onItemSelected: function(viewerInst, docItem, geometryItem) {
                    geometryItem = geometryItem || docItem;
                    setViewer(viewerInst, geometryItem);
                }
            }
        );

        // Pass in viewer instance (if any)
        var viewerInstance = viewingApp.getCurrentViewer();
        var docSheetItem = viewingApp.getSelectedItem ? viewingApp.getSelectedItem() : null; // TODO: Remove condition when staged.
        setViewer(viewerInstance, docSheetItem);

        // Let the comments panel know that we are dealing with a multi-sheet document.
        if (Array.isArray(viewingApp.geometryItems) && viewingApp.geometryItems.length > 1) {
            mCommentsPanel.setHasMultipleSheets();
        }
    }

    function onResetViewer() {
        selectAppComment(null);
    }

    function releaseViewer() {
        if (!mViewerInstance) {
            return;
        }

        mViewerInstance.removeEventListener(Autodesk.Viewing.RESET_EVENT, onResetViewer);
        mbViewerReady = false;
    }

    function setViewer(viewerInstance, docSheetItem) {

        // This may happen when user selects a 'view' item for the current
        // loaded geometry.
        if (docSheetItem === mSheetItem) {
            return;
        }

        if (viewerInstance) {

            releaseViewer();
            mbViewerReady = false;
            mbModelLoaded = false;

            mViewerInstance = viewerInstance;
            mViewerInstance.addEventListener(Autodesk.Viewing.RESET_EVENT, onResetViewer);

            // get the sheet urn
            var sheetURN;
            var svfLoader = viewerInstance.impl.loader;
            if (svfLoader && svfLoader.svfFullPath) {
                var urnIndex = svfLoader.svfFullPath.indexOf(0, "urn:");
                sheetURN = svfLoader.svfFullPath.substr(urnIndex);
            }

            // Get sheet item using sheet urn (if any)
            if (docSheetItem) {
                mSheetItem = docSheetItem;
            } else {
                mSheetItem = null;
                if (settings.getGeometryItemFromURN) {
                    mSheetItem = settings.getGeometryItemFromURN(sheetURN);
                }
            }

            mCommentsViewer.setViewer(viewerInstance);
            mMarkupsActionBar && mMarkupsActionBar.setViewer(viewerInstance);

            var bIsViewer3d = true; // default to true (Because Columbus)
            if (mSheetItem) {
                bIsViewer3d = (mSheetItem.role === "3d");
            }
            mCommentsPanel.onViewerChange(true, bIsViewer3d);

            updateAppCommentsCurrentSheet();
            filterComments();
        }
        else {
            mCommentsPanel.onViewerChange(false);
        }
    }

    function setGeometryItems(geometryItemList) {
        var sheetGuidLabelMap = {};
        geometryItemList.forEach(function(item){
            sheetGuidLabelMap[item.guid] = item.name;
        });
        mCommentsPanel.setSheetGuidLabelMap(sheetGuidLabelMap);
        if (geometryItemList.length > 0) {
            mCommentsPanel.setHasMultipleSheets();
        }
        updateAppCommentsCurrentSheet();
    }

    /**
     * Checks if a comment belongs to the currently shown sheet.
     * @param {Object} appComment
     * @returns {boolean}
     * @private
     */
    function isCommentFromCurrentSheet(appComment) {

        // Attempt first to filter using layoutName.
        // We COULD use layoutIndex, but name _feels_ more reliable (12/2/14).
        if (mSheetItem && appComment.dbComment.layoutName) {
            return (appComment.dbComment.layoutName === mSheetItem.guid);
        }

        return true; // Backwards compatibility for when no sheet information is available.
    }

    function refreshComment(appComment) {
        mCommentsPanel.refreshCommentEntry(appComment);
    }

    function decodeText(content, regExp, captureCallback) {
        return Autodesk.Comments2.decodeText(content, regExp, captureCallback);
    }

    function checkBothReady() {
        if (mbPanelReady && mbViewerReady) {
            fetchExternalNodeIdMapping(function(mapping) {

                // onComplete (which can be success or failure) //
                if (mapping && !Autodesk.Comments2.Utils.isEmptyObject(mapping)) {
                    normalizeLoadedCommentsFromFusion(mAppCommentList, mapping);
                }

                onModelLoaded();
            });
        }
    }

    function isJsonVersionOrGreaterThan(dbComment, jsonVer) {
        if ('jsonVersion' in dbComment) {
            if (!dbComment.jsonVersion) {
                return false; // Attribute present, but value is "" or similar
            }

            // Most common use case is this.
            if (dbComment.jsonVersion === jsonVer) {
                return true; // Perfect match, accept it
            }

            // Else, check the major / minor version numbers
            var dbParts = String(dbComment.jsonVersion).split('.');
            var dbMajor = Number(dbParts[0]);
            var dbMinor = (dbParts.length) > 1 ? Number(dbParts[1]) : 0;

            var verParts = jsonVer.split('.');
            var verMajor = Number(verParts[0]);
            var verMinor = Number(verParts[1]);

            if (dbMajor < verMajor) {
                return false; // Unlikely
            } else if (dbMajor > verMajor) {
                return true; // Highly unlikely.
            }

            // dbMajor === verMajor
            return (dbMinor >= verMinor);
        }
        // if no dbComment.jsonVersion, we assume its less than "2.0"
        return false;
    }

    function isTagVersionLessThan(dbComment, version) {
        var tagValue = getCommentTag(dbComment, 'commentVersion');
        var commentVersion = 1; // Assume version 1 if no tag
        if (tagValue !== null) {
            commentVersion = tagValue;
        }
        return Number(commentVersion) < Number(version);
    }

    function isTagVersionGreaterThan(dbComment, version) {
        var tagValue = getCommentTag(dbComment, 'commentVersion');
        var commentVersion = 1; // Assume version 1 if no tag
        if (tagValue !== null) {
            commentVersion = tagValue;
        }
        return Number(commentVersion) > Number(version);
    }

    function onModelLoaded() {

        mbModelLoaded = true;
        showCurrentSheetMarkers();
        updateMarkersVisibility();

        var selectedComment = mSelectedComment;
        if (selectedComment && isCommentFromCurrentSheet(selectedComment)) {
            restoreCommentSnapshot(selectedComment);
        }

        // federico.medina: Hate this solution.
        setTimeout(selectDefaultComment, 300);
    }

    function fetchExternalNodeIdMapping(onComplete) {

        // No need to re-fetch the external-ids when we've done it before.
        if (mSheetItem && mModelExternalIdFetched[mSheetItem.guid]) {
            // dbComments should have been updated for this model;
            // no need to send the mapping back to onComplete function.
            onComplete();
            return;
        }

        try {
            if (mViewerInstance.model.is2d()) {
                onComplete();
            } else {
                mViewerInstance.model.getExternalIdMapping(function(result){
                    // onSuccess //
                    if (mSheetItem) {
                        mModelExternalIdFetched[mSheetItem.guid] = result;
                    }
                    onComplete(result);
                }, function () {
                    // onFailure //
                    onComplete();
                });
            }
        }
        catch (err) {
            console.warn("getExternalIdMapping API call not available in viewer. Check viewer version.");
            onComplete();
        }
    }

    function normalizeLoadedCommentsFromFusion(appCommentList, idMapping) {
        function mapExternalToDbId(externalId) {
            return idMapping[externalId];
        }
        var sheetAppComments = appCommentList.filter(function(appComment){
            return isCommentFromCurrentSheet(appComment);
        });
        sheetAppComments.forEach(function(appComment){
            var objectSetList = appComment.dbComment.objectSet;
            var objectSet = Autodesk.Comments2.getObjectSetElementWithIdType(objectSetList, 'lmv');

            // Nothing to do, we already have lmv data values
            if (objectSet) {
                return;
            }

            // Else, no lmv objectSet element. Probably a comment coming from Fusion (or similar).
            // Create objectSet entry in index 0 with lmv values.
            var externalObjectSet = Autodesk.Comments2.getObjectSetElementWithIdType(objectSetList, 'external');
            if (!externalObjectSet) {
                return;
            }

            var lmvObjectSet = JSON.parse(JSON.stringify(externalObjectSet));

            // Map external ids back to lmv dbIds
            lmvObjectSet.id = lmvObjectSet.id.map(mapExternalToDbId);
            lmvObjectSet.isolated = lmvObjectSet.isolated.map(mapExternalToDbId);
            lmvObjectSet.hidden = lmvObjectSet.hidden.map(mapExternalToDbId);
            lmvObjectSet.idType = 'lmv';

            // patch appComment //
            if (lmvObjectSet.id.length > 0) {
                appComment['node-id'] =  lmvObjectSet.id[0];
            }

            appComment['highlight-node-ids'] = lmvObjectSet.id.concat(); // shallow copy

            // Make sure we pushed it as the first element
            objectSetList.unshift(lmvObjectSet);
        });
    }

    ////////////////////
    // Event handlers //
    ////////////////////
    function onChangeCommentPanelVisibility(event) {
        updateMarkersVisibility();
        updatePinToolVisibility();

        if(!event.data.visible) {
            if (mCommentsViewer.annotationsEditor && mCommentsViewer.annotationsEditor.enableEditTool) {
                mCommentsViewer.annotationsEditor && mCommentsViewer.annotationsEditor.enableEditTool(false);
            }
        }
    }
    function onClickCommentEntry(event) {
        // Abort operation we are still animating
        if (viewer && viewer.navigation && viewer.navigation.getTransitionActive()) {
            return;
        }

        var appComment = event.data;
        toggleAppComment(appComment);

        // if the mouse is still over the comment marker, highlight the viewer marker
        if(mHoveredComment) {
            mHoveredComment['marker-controller'].setActive(true);
        }
    }
    function onRequestSelectCommentEntry(event) {
        // Abort operation we are still animating
        if (viewer && viewer.navigation && viewer.navigation.getTransitionActive()) {
            return;
        }

        var appComment = event.data;
        selectAppComment(appComment);
    }
    function onRequestNewComment(event) {
        var grabViewerState = true;
        var textBody = event.data.commentBody;
        var attachments = mAppAttachmentsList.concat();
        mAppAttachmentsList = []; // Reset attachments

        if (settings.formatCommentToSend) {
            var textDiv = event.data.textArea; // A360 requirement
            settings.formatCommentToSend(textDiv.id, function(format) {
                if (format && format.commentText) {
                    textBody = format.commentText;
                }
                startPostNewCommentFlow(textBody, attachments, grabViewerState);
            });
        }
        else
        {
            startPostNewCommentFlow(textBody, attachments, grabViewerState);
        }
    }
    function onRequestNewCommentReply(event) {
        var textBody = event.data.commentBody;
        var parentAppComment = event.data.parentAppComment;

        if (settings.formatCommentToSend) {
            var textDiv = event.data.textArea; // A360 requirement
            settings.formatCommentToSend(textDiv.id, function(format) {
                if (format && format.commentText) {
                    textBody = format.commentText;
                }
                startPostCommentReplyFlow(textBody, parentAppComment);
            });
        } else {
            startPostCommentReplyFlow(textBody, parentAppComment);
        }
    }
    function onEnterAnnotationsEditMode(event) {
        mCommentsViewer.enterAnnotationsEditMode();
    }
    function onCancelAnnotationsEditMode(event) {
        mCommentsViewer.cancelAnnotationsEditMode();
    }
    function onLeaveAnnotationsViewMode() {
        selectAppComment(null);
    }
    function onFilterChangedCurrentSheet(event) {
        mFilters.currentSheetOnly = event.value;
        filterComments();
    }
    function onFilterChangedVersion(event) {
        mFilters.version = event.value;
        filterComments();
    }
    function onSortChanged(event) {
        mSortStrategy = event.value;
        sortComments();
    }
    function onRequestDeleteComment(event) {
        var appComment = event.data;
        startDeleteCommentFlow(appComment);
    }
    function onRequestDeleteCommentReply(event) {
        var appCommentReply = event.data;
        startDeleteCommentReplyFlow(appCommentReply);
    }
    function onClickFramedTool(event) {
        var activeToolName = mCommentsViewer.toggleFramedTool(event.data);
        updateMarkersVisibility();
        mCommentsPanel.setActiveFramedTool(activeToolName);

        if (activeToolName) {
            mCommentsViewer.exitMarkupModes();
            mMarkupsActionBar.enterToolFrame();
        } else {
            mMarkupsActionBar.leaveToolFrame();
        }
    }
    function onAttachmentRemoved(event) {
        var attachmentData = event.data;
        var indexRem = mAppAttachmentsList.indexOf(attachmentData);
        if (indexRem !== -1) {
            mAppAttachmentsList.splice(indexRem, 1);
        }
        // Remove associated attachments with no UI representation
        if (Array.isArray(attachmentData.relatedAttachments)) {
            attachmentData.relatedAttachments.forEach(function(relatedAppAttachment){
                var indexRelRem = mAppAttachmentsList.indexOf(relatedAppAttachment);
                if (indexRelRem !== -1) {
                    mAppAttachmentsList.splice(indexRelRem, 1);
                }
            });
        }
    }
    function onFetchOssAttachment(event) {
        var context = event.data;
        var ossPath = event.data.ossPath;
        var ossDataType = event.data.dataType || Autodesk.Comments2.Constants.ATTACHMENT_DATA_TYPE_TEXT;
        mServerOperator.getAttachment(context, ossPath, ossDataType);
    }
    function removeAllAttachments() {
        mCommentsPanel.removeAllAttachments();
        mAppAttachmentsList = [];
    }
    function onViewerReady(event) {
        // Geometry has been fully loaded into the viewer
        if (!mbViewerReady) {
            mbViewerReady = true;
            checkBothReady();
        }
    }
    function onRequestSnapshot(){

        // Support only 1 attachment //
        removeAllAttachments();

        var appAttachmentThumbBig = {
            type: Autodesk.Comments2.Constants.ATTACHMENT_TYPE_SNAPSHOT,
            id: null,       // Populated in ServerOperator.uploadOssAttachmentsStep2
            data: null,     // Populated in takeAndSendScreenCaptureAnimation()
            ossPath: null,  // Populated after posting to OSS
            label: Autodesk.Comments2.Localization["image_capture_label"],
            dbAttachment: null
        };

        mAppAttachmentsList.push(appAttachmentThumbBig);

        // Visual attachment goes only to the Thumb Small
        var attachmentDiv = mCommentsPanel.createNewAttachment(appAttachmentThumbBig);
        takeAndSendScreenCaptureAnimation(appAttachmentThumbBig, attachmentDiv, false, false);
    }
    function onSaveMarkups(event) {

        // Support only 1 attachment //
        removeAllAttachments();

        var appAttachmentThumbBig = {
            type: Autodesk.Comments2.Constants.ATTACHMENT_TYPE_SNAPSHOT,
            id: null,       // Populated in ServerOperator.uploadOssAttachmentsStep2
            data: null,     // Populated in takeAndSendScreenCaptureAnimation()
            ossPath: null,  // Populated after posting to OSS
            label: Autodesk.Comments2.Localization["markups_label"],
            dbAttachment: null
        };

        var markupsData = mCommentsViewer.getMarkupsData();
        var appAttachmentMarkup = {
            type: Autodesk.Comments2.Constants.ATTACHMENT_TYPE_MARKUP,
            id: null,       // Populated in ServerOperator.uploadOssAttachmentsStep2
            data: markupsData,
            ossPath: null,  // Populated after posting to OSS
            label: Autodesk.Comments2.Localization["markups_label"],
            dbAttachment: null
        };

        mAppAttachmentsList.push(appAttachmentThumbBig);
        mAppAttachmentsList.push(appAttachmentMarkup);

        // If attachment gets removed, we need a way to remove related attachments
        appAttachmentThumbBig.relatedAttachments = [appAttachmentMarkup];

        // Visual attachment goes only to the Thumb Small
        var attachmentDiv = mCommentsPanel.createNewAttachment(appAttachmentThumbBig);
        takeAndSendScreenCaptureAnimation(appAttachmentThumbBig, attachmentDiv, false, true);
    }
    function onEscapeCreateMarkups(){
        mMarkupsActionBar && mMarkupsActionBar.escapeCreateMarkups();
    }
    function onMarkupsRestored(event) {
        // NOTE: appAttachment can be null, and that is fine.
        // It account for the case where the markup data has not yet been
        // downloaded from the OSS bucket.
        var appAttachment = event.data.appAttachment;
        mMarkupsActionBar.enterViewMode(appAttachment);
    }
    function onEnterCommentMarker(event) {
        var appComment = event.data;
        mHoveredComment = appComment;
        if (mSelectedComment) {
            return;
        }

        if (isCommentFromCurrentSheet(appComment)) {
            mCommentsViewer.setCommentGeometryHighlight(appComment);
        }
        appComment['marker-controller'].setActive(true);
    }
    function onLeaveCommentMarker(event) {
        mHoveredComment = null;
        if (mSelectedComment) {
            return;
        }
        var appComment = event.data;

        mCommentsViewer.clearCommentGeometryHighlight(appComment);
        appComment['marker-controller'].setActive(false);
    }
    function onClickViewerMarker(event) {
        var appComment = event.data;
        selectAppComment(appComment);

        // Notify app that the comment panel needs to be open.
        if (settings.openCommentsPanel) {
            settings.openCommentsPanel();
        }

        mCommentsPanel.scrollToComment(appComment);
    }
    function onEnterViewerMarker(event) {
        var appComment = event.data;
        if (isCommentFromCurrentSheet(appComment)) {
            mCommentsViewer.setCommentGeometryHighlight(appComment);
        }
        appComment['marker-controller'].getCommentPanelDiv().classList.add("active");
    }
    function onLeaveViewerMarker(event) {
        var appComment = event.data;
        if (mSelectedComment) {
            return;
        }

        appComment['marker-controller'].getCommentPanelDiv().classList.remove("active");
        mCommentsViewer.clearCommentGeometryHighlight(appComment);
    }
    function onRequestCaptureImage() {
        // Associated with pinTool
        onRequestSnapshot();
    }
    function onRequestFocusToPostComment(event) {

        if (!mCommentsViewer.framedToolActive) {
            mCommentsPanel.setActiveFramedTool(null);
            mMarkupsActionBar.leaveToolFrame();
        }
        updateMarkersVisibility();
        updatePinToolVisibility();

        mCommentsPanel.setFocusToPostComment();
    }
    function onFramedToolsCanceled(event) {
        mCommentsPanel.setActiveFramedTool(null);
        mMarkupsActionBar.leaveToolFrame();
        updateMarkersVisibility();
    }
    function onRequestUnselectComment(event) {
        if(mSelectedComment && mbModelLoaded) {
            selectAppComment(null);
        }
    }
    function onRequestContextMenuComment() {
        if (Autodesk.Comments2.featureEnabled(settings, "markups")) {
            onClickFramedTool({data: Autodesk.Comments2.Constants.FRAMED_TOOL_POINT});
        } else {
            mCommentsPanel.setFocusToPostComment();
        }
    }
    function onFocusChangeNewComment(event) {
        setNewCommentFocus(event.data.focused);
    }
    function onScrollCommentEntries(event) {
        if (mSelectedComment) {
            drawCommentLine(mSelectedComment);
        }
    }
    function onRequestChangeSheet(event) {
        var appComment = event.data;
        if (this.settings.openCommentGeometryForViewable) {
            // From this point we assume the model loaded in the viewer will change.
            mbViewerReady = false;
            this.settings.openCommentGeometryForViewable(appComment.dbComment.layoutName);
        }
    }

    /////////////////////
    // Private methods //
    /////////////////////

    function initServerComm(args) {

        var storageUri = generateStorageUri();

        mServerOperator = new Autodesk.Comments2.ServerOperator(args);
        mServerOperator.initialize(storageUri);

        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_REQUEST_SUCCESS, onRequestCommentSuccess);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_REQUEST_FAILURE, onRequestCommentFailure);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_POST_SUCCESS, onPostCommentSuccess);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_POST_FAILURE, onPostCommentFailure);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_POST_REPLY_SUCCESS, onPostCommentReplySuccess);
        // mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_POST_REPLY_FAILURE, onPostCommentReplyFailure);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_DELETE_SUCCESS, onDeleteCommentSuccess);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_DELETE_FAILURE, onDeleteCommentFailure);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_DELETE_REPLY_SUCCESS, onDeleteCommentReplySuccess);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_DELETE_REPLY_FAILURE, onDeleteCommentReplyFailure);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_SUCCESS, onUploadAttachmentSuccess);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_FAILURE, onUploadAttachmentFailure);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_SUCCESS, onGetAttachmentSuccess);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_FAILURE, onGetAttachmentFailure);
        mServerOperator.addEventListener(mServerOperator.EVENT_COMMENTS2_SERVER_FETCH_LOCATION_OSS_FAILURE, onFetchLocationOssFailure);

        mServerOperator.requestComments();
    }


    /**
     * Generates the id where comments will be stored/loaded.
     * @return {string} The url loaded by the viewer.
     * @private
     */
    function generateStorageUri() {
        var retValue = 'defaultUrnName';
        if (settings.urn !== undefined) {
            retValue = settings.urn;
        } else {
            try {
                // This may fail when:
                // - testing local files
                retValue = mCommentsViewer.viewer.impl.svfloader.svfUrn;
            }
            catch (e) {}
        }

        retValue = Autodesk.Comments2.Utils.encodePhrase(retValue);
        return retValue;
    }

    function onRequestCommentSuccess(event) {

        var comments = event.data;

        // Create App comments
        mAppCommentList = comments.map(function(dbComment) {
            return createAppCommentFromDbComment(dbComment);
        });

        // Render them into the panel
        var isActive = false; // set the comments to be not active by default
        var canHaveReplies = Autodesk.Comments2.featureEnabled(settings, "replies");
        mAppCommentList.forEach(function(appComment) {
            mCommentsPanel.createCommentEntry(appComment, canHaveReplies);
            addCommentEntryMarker(appComment);
            mCommentsPanel.refreshCommentEntry(appComment);
            mCommentsPanel.setCommentEntryActive(appComment, isActive);

            if(canHaveReplies) {
                appComment.replies = createAppCommentRepliesFromAppComment(appComment);
                appComment.replies.forEach(function(appCommentReply) {
                    mCommentsPanel.createCommentReplyEntry(appCommentReply);
                    mCommentsPanel.refreshCommentReplyEntry(appCommentReply);
                });
            }
        });

        mCommentsPanel.onRequestComments();

        sortComments();
        mbPanelReady = true;
        checkBothReady();
    }

    function onRequestCommentFailure() {
        // TODO: On failure, we need to notify the user somehow
        // as well as giving the opportunity to retry.
        mCommentsPanel.onRequestComments();
    }

    function startPostNewCommentFlow(commentBodyText, attachments, grabViewerState) {
        offlineNewCommentFlow(commentBodyText, attachments, grabViewerState, function(appComment) {
            onlineNewCommentFlow(appComment);
        });
    }

    function offlineNewCommentFlow(commentBodyText, attachments, grabViewerState, onAppCommentReady) {

        // Add comment to Panel before sending a server request.
        var allowDelete = true; // when creating a new comment, it can be deleted by the poster
        var isActive = false;  // set the comment to be inactive by default
        grabViewerState = grabViewerState || mCommentsViewer.viewerHasSelection();
        var appComment = createAppComment(commentBodyText, attachments, grabViewerState);
        mAppCommentList.push(appComment);
        var canHaveReplies = Autodesk.Comments2.featureEnabled(settings, "replies");
        mCommentsPanel.createCommentEntry(appComment, canHaveReplies);
        // add the commentEntryMarker
        addCommentEntryMarker(appComment);
        // and add the marker to the viewer
        mCommentsViewer.addCommentMarkerToViewer(appComment);
        // do the initial refresh to populate what data is available
        // before getting a response from the server
        mCommentsPanel.refreshCommentEntry(appComment, allowDelete);
        mCommentsPanel.setCommentEntryActive(appComment, isActive, allowDelete);

        var commentVisible = filterComment(appComment);
        mCommentsPanel.setCommentVisibility(appComment, commentVisible);

        sortComments();

        // Clean up the Panel UI just before returning a new appComment
        mCommentsPanel.offlineNewCommentFlow(appComment);
        // Close any active framed tools
        mCommentsViewer.cancelFramedTools();
        mCommentsViewer.clearPinToolSelection();
        mViewerInstance && mViewerInstance.clearSelection();
        updateMarkersVisibility();

        if (grabViewerState) {
            gatherViewerExternalIds(appComment.dbComment, function() {
                // on gathered
                onAppCommentReady(appComment);
            });
        } else {
            onAppCommentReady(appComment);
        }
    }

    function onlineNewCommentFlow(appComment) {
        if (settings.customPostComment) {
            // IN A360 flow we skip Post-to-OSS step
            postCommentToCommentingServer(appComment);
        } else {
            postAttachmentsToOSS(appComment);
        }
    }

    function postAttachmentsToOSS(appComment) {

        // Find out what attachments we need to post to OSS bucket (snapshots and markup)
        var ossAttachments = Autodesk.Comments2.arrayReduce(
            appComment.attachments, [],
            function(results, curr){
                if (curr.type === Autodesk.Comments2.Constants.ATTACHMENT_TYPE_SNAPSHOT ||
                    curr.type === Autodesk.Comments2.Constants.ATTACHMENT_TYPE_MARKUP) {
                    results.push(curr);
                }
                return results;
            }
        );

        // Skip this step if there is no need to upload attachments to OSS //
        if (ossAttachments.length === 0) {
            postCommentToCommentingServer(appComment);
            return;
        }

        mServerOperator.uploadOssAttachments(appComment, ossAttachments);
        // Logic continues on method onUploadAttachmentSuccess().
        // which gets triggered when server responds.
    }

    function postCommentToCommentingServer(appComment) {
        mServerOperator.postComment(appComment);
    }

    function onPostCommentSuccess(event) {

        var appComment = event.data;
        var dbComment = appComment.dbComment;
        appComment['lastPost'] = new Date(dbComment['published']).getTime();
        appComment['serverStatus'] = Autodesk.Comments2.Constants.COMMENT_STATUS_SAVED_TO_DB;
        appComment['uiId'] = dbComment["index"];
        mMaxUIId = Math.max(parseInt(appComment['uiId']), mMaxUIId);

        // Metrics
        if (settings.postCommentCallback) {
            settings.postCommentCallback(appComment);
        }

        mCommentsPanel.onPostComment(appComment);

        // refresh the comment entry marker with the updated data
        if(appComment['marker-controller']) {
            appComment['marker-controller'].setUiId(appComment.uiId);
        }
    }

    /**
     * Applies a linkify transform to the text comment.
     * The purpose is to submit a comment where urls have html tags
     * around them to make them clickable.
     *
     * @param {String} dbCommentTextBody
     * @returns {String}
     */
    function convertDbCommentTextBodyToUrlHtmlTags(dbCommentTextBody) {
        var appCommentTextBody = dbCommentTextBody;
        // appCommentTextBody = appCommentTextBody.replace(/(?:\r\n|\r|\n)/g, '<br/>'); // NOTE: Disabled; There should be no need for it
        appCommentTextBody = Autodesk.Comments2.linkify(appCommentTextBody);
        return appCommentTextBody;
    }

    /**
     * TODO: Mentions should not be a part of comments panel per se.
     * Mentions are only supported in the context of an A360 Application environment.
     *
     * @param {String} dbCommentTextBody
     * @returns {String}
     */
    function convertDbCommentTextBodyMentionsToHtmlTags(dbCommentTextBody) {
        var appCommentTextBody = dbCommentTextBody;
        if (settings.generateMentionHtmlTags) {
            appCommentTextBody = settings.generateMentionHtmlTags(dbCommentTextBody);
        }
        return appCommentTextBody;
    }

    function onPostCommentFailure(event) {

        // A360 requires us to do nothing in that case.
        // Thus, we only react when there is no customPostComment callback.
        if (!settings.customPostComment) {
            var appComment = event.data;
            appComment['serverStatus'] = Autodesk.Comments2.Constants.COMMENT_STATUS_FAILED_TO_POST;
            mCommentsPanel.onPostCommentFailure(appComment);
        }
    }

    function onFetchLocationOssFailure(event) {

        var appComment = event.data;
        appComment['serverStatus'] = Autodesk.Comments2.Constants.COMMENT_STATUS_FAILED_TO_POST;
        mCommentsPanel.onPostCommentFailure(appComment);
    }

    function startPostCommentReplyFlow(commentBodyText, parentAppComment) {
        var appCommentReply = offlineCommentReplyFlow(commentBodyText, parentAppComment);
        onlineCommentReplyFlow(appCommentReply);
    }

    function offlineCommentReplyFlow(commentBodyText, parentAppComment) {

        // Add comment to Panel before sending a server request.
        var allowDelete = true; // when creating a new comment, it can be deleted by the poster
        var appCommentReply = createAppCommentReply(commentBodyText, parentAppComment);
        mCommentsPanel.createCommentReplyEntry(appCommentReply);
        // do the initial refresh to populate what data is available
        // before getting a response from the server
        mCommentsPanel.refreshCommentEntry(parentAppComment);
        mCommentsPanel.refreshCommentReplyEntry(appCommentReply);

        // Clean up the Panel UI just before returning a new appComment
        mCommentsPanel.offlineNewCommentReplyFlow(appCommentReply);
        return appCommentReply;
    }

    function onlineCommentReplyFlow(appCommentReply) {

        // TODO: Investigate why formatCommentToSend is failing here
        postCommentReplyToCommentingServer(appCommentReply);

        /*if (settings.formatCommentToSend) {
            // A360 requirement
            var postCommentDivId = mCommentsPanel.getNewReplyTextAreaId(appCommentReply.parent);
            settings.formatCommentToSend(appCommentReply, postCommentDivId, postCommentReplyToCommentingServer);
        }
        else
        {
            postCommentReplyToCommentingServer(appCommentReply);
        }*/
    }

    function postCommentReplyToCommentingServer(appCommentReply) {
        mServerOperator.postCommentReply(appCommentReply);
    }

    function onPostCommentReplySuccess(event) {

        var appCommentReply = event.data;
        var dbComment = appCommentReply.dbComment;
        appCommentReply.parent['lastPost'] = appCommentReply['lastPost'] = new Date(dbComment['published']).getTime();
        appCommentReply['serverStatus'] = Autodesk.Comments2.Constants.COMMENT_STATUS_SAVED_TO_DB;

        // Metrics
        if (settings.postCommentCallback) {
            settings.postCommentCallback(appCommentReply);
        }

        mCommentsPanel.onPostCommentReply(appCommentReply);
    }

    /*
    function onPostCommentReplyFailure(event) {

        // A360 requires us to do nothing in that case.
        // Thus, we only react when there is no customPostComment callback.
        if (!settings.customPostCommentReply) {
            // TODO: Notify the user that the comment was not able to be posted into the server.
        }
    }
    */

    function startDeleteCommentFlow(appComment) {

        offlineDeleteCommentFlow(appComment);
        onlineDeleteCommentFlow(appComment);
    }

    function offlineDeleteCommentFlow(appComment) {

        if (mSelectedComment === appComment) {
            selectAppComment(null);
        }
        var indexRm = mAppCommentList.indexOf(appComment);
        mAppCommentList.splice(indexRm, 1);
        mCommentsPanel.onDeleteComment(appComment);
        if (isCommentFromCurrentSheet(appComment)) { // TODO: Do we really need the condition?
            mCommentsViewer.onDeleteComment(appComment);
        }
    }

    function onlineDeleteCommentFlow(appComment) {
        mServerOperator.deleteComment(appComment);
    }

    function onDeleteCommentSuccess(event) {
        // Nothing //
        // We don't need to delete attachments uploaded by us.
        // There is no bucket id information kept around for this.
    }

    function onDeleteCommentFailure(event) {
        // TODO: Do nothing for now.
    }

    function startDeleteCommentReplyFlow(appCommentReply) {

        var appCommentParent = offlineDeleteCommentReplyFlow(appCommentReply);
        onlineDeleteCommentReplyFlow(appCommentReply, appCommentParent);
    }

    function offlineDeleteCommentReplyFlow(appCommentReply) {

        var parentComment = appCommentReply.parent;
        var indexRm = parentComment.replies.indexOf(appCommentReply);
        parentComment.replies.splice(indexRm, 1);
        mCommentsPanel.onDeleteCommentReply(appCommentReply);
        return parentComment;
    }

    function onlineDeleteCommentReplyFlow(appCommentReply, appCommentParent) {
        mServerOperator.deleteCommentReply(appCommentReply, appCommentParent);
    }

    function onDeleteCommentReplySuccess(event) {
        // Nothing to do for now
    }

    function onDeleteCommentReplyFailure(event) {
        // TODO: Do nothing for now.
    }

    function generateAttachmentOssId(sufix) {
        return [
            settings.applicationName || 'unknownApp', // application name
            settings.urn,                             // urn
            Autodesk.Comments2.generateGuid(),        // client generated guid
            sufix
        ].join('_');
    }

    /**
     * Handler for when a single or multiple attachments have been uploaded
     *
     * @param event
     */
    function onUploadAttachmentSuccess(event) {
        var eventData = event.data;
        var appComment = eventData.appComment;
        var responses = eventData.responses;

        // Create attachments array with format accepted by the Commenting Service.
        // https://wiki.autodesk.com/pages/viewpage.action?pageId=160643881
        appComment.dbComment.attachment = responses.map(function(response) {
            var appAttachment = response.appAttachment;
            var objectData = response.responseObject.objects[0];
            var ossKey = objectData['key'];
            // This is a dbComment.dbAttachment object.
            return {
                id: ossKey,
                name: appAttachment.label,
                // type: objectData['content-type'], TODO: Save content type when dealing with Annotation files.
                url: appAttachment.ossUrn,
                clazz: appAttachment.type
            };
        });

        // Now that attachments are up, post the comment to the Commenting Service
        postCommentToCommentingServer(appComment);
    }

    function onUploadAttachmentFailure(event) {
        // TODO: Do nothing for now.
    }

    function onGetAttachmentSuccess(event) {

        var context = event.data.context;
        var encodedImage = event.data.responseText;
        context.callback(encodedImage);
    }

    function onGetAttachmentFailure(event) {
        // TODO: Do nothing for now.
    }

    function sortComments() {

        if (mSortStrategy === Autodesk.Comments2.Constants.SORT_OLDER_ON_TOP) {
            mAppCommentList.sort(function(appComment1, appComment2) {
                var value1 = appComment1['lastPost'] || 0;
                var value2 = appComment2['lastPost'] || 0;
                return value1 - value2;
            });
        }
        else if (mSortStrategy === Autodesk.Comments2.Constants.SORT_NEWER_ON_TOP) {
            mAppCommentList.sort(function(appComment1, appComment2) {
                var value1 = appComment1['lastPost'] || 0;
                var value2 = appComment2['lastPost'] || 0;
                return value2 - value1;
            });
        }

        mCommentsPanel.onSortComments(mAppCommentList.concat());
        mCommentsPanel.updateStatusBar(mFilters);
    }

    /**
     * Filters comments based on the the type of comment filtering and can also limit them to only show the comments
     * associated with the current sheet as well.
     */
    function filterComments() {
        mAppCommentList.forEach(function(appComment){
            var isVisible = filterComment(appComment);
            mCommentsPanel.setCommentVisibility(appComment, isVisible);
        });
        mCommentsPanel.onFilterComments(mFilters);
    }

    /**
     * Returns true if an appComment should be visible given the current
     * state of filters.
     *
     * @param {Object} appComment
     * @returns {boolean}
     */
    function filterComment(appComment) {

        // Current sheet
        if (mFilters.currentSheetOnly) {
            if (!isCommentFromCurrentSheet(appComment)) {
                return false;
            }
        }

        // Version
        if (mFilters.version !== Autodesk.Comments2.Constants.FILTER_VERSION_ANY) {
            return appComment['thisVersion'];
        }

        return true;
    }

    function updateAppCommentsCurrentSheet() {
        if (!mSheetItem) {
            return;
        }
        mAppCommentList.forEach(function(appComment){
            appComment['onCurrentSheet'] = isCommentFromCurrentSheet(appComment);
            mCommentsPanel.refreshCommentEntry(appComment);
        });
    }

    function injectDbCommentData(dbComment, commentBodyText, grabViewerState) {

        dbComment["id"] = null; // gets populated with the acknowledgement of a post() to // backend.
        dbComment["body"] = commentBodyText;
        dbComment["status"] = 'open'; //FILTER_STATUS_OPEN
        dbComment["jsonVersion"] = Autodesk.Comments2.Constants.JSON_VERSION_DATA;

        if (mSheetItem) {
            dbComment["layoutName"] = mSheetItem.guid;
            dbComment["layoutIndex"] = mSheetItem.order;
        }

        // Version 1 requires nodeOffset conversion.
        pushTag(dbComment, { name:'commentVersion', value:3 });

        if (mCommentsViewer.pinToolSelection && mCommentsViewer.pinToolSelection.selectedNodeOffset) {
            var nodeOffset = mCommentsViewer.pinToolSelection.selectedNodeOffset;
            pushTag(dbComment, {name: "nodeOffset", value: nodeOffset.toArray()});
        }

        // Send User Data only when both an oxygenId AND a displayName are provided.
        // Else we rely on backend to provide these values.
        if (settings.oxygenId && settings.displayName) {
            dbComment["actor"] = {
                id: settings.oxygenId,
                name: settings.displayName
            };
        }

        // Document version
        if (settings.version) {
            if(!dbComment.parent) {
                dbComment.parent = {};
            }
            dbComment.parent.version = settings.version;
        }

        // Document type - Mobile team requirement
        dbComment["type"] = grabViewerState ? "geometry" : "comment";

        // Posting a comment from web
        dbComment["inputSource"] = "Web";
    }

    function createAppComment(commentBodyText, attachments, grabViewerState) {
        return createAppCommentAux(null, commentBodyText, attachments, grabViewerState);
    }

    function createAppCommentFromDbComment(dbComment) {
        return createAppCommentAux(dbComment);
    }

    /**
     * Creates and returns a comment from the state of viewer and the UI
     * @param {Object|null} serverDbComment - Can optionally take data loaded from the Comment backend to build
     *                          the comment instead of using the current state of the viewer.
     * @param {string} [commentBodyText] - When no dbData is present, use this value for the comment body.
     * @param {Array} [attachments] - An array of attachments associated with the comment
     * @param {Object} [grabViewerState] - Whether the comment is being posted for the entire document (true) or not (false)
     *
     * @return {Object} A comment object used by the comments panel. Property 'dbComment' contains the comment stored
     *                  in backend.
     * @private
     */
    function createAppCommentAux(serverDbComment, commentBodyText, attachments, grabViewerState) {

        var isNewComment = true;
        var bThisVersion = true;
        var documentVersion = ('version' in settings) ? parseInt(settings.version) : 1;
        var commentVersion = documentVersion;
        var dbComment;

        if (serverDbComment) {
            // We are loading a dbData from server
            isNewComment = false;
            dbComment = serverDbComment;
            attachments = createAppAttachmentsFromDbComment(dbComment);
            commentVersion = 'version' in dbComment.parent ? parseInt(dbComment.parent.version) : 1;
            bThisVersion = (documentVersion === commentVersion);
            commentBodyText = convertDbCommentTextBodyMentionsToHtmlTags(dbComment['body']);
        } else if (grabViewerState) {
            // New sheet specific comment. We do need the viewer state.
            dbComment = mCommentsViewer.createSnapshot();
        } else {
            // New global comment. No need for viewer state.
            dbComment = {};
        }

        var selectedNodeIds = getSelectedNodeIds(dbComment);

        var nodeId = null;
        if(selectedNodeIds.length > 0) {
            nodeId = selectedNodeIds[0];
        }

        // A comment on the database is just a viewer state object with additional key/values
        // that are compliant with backend specifications.
        if (isNewComment) {
            commentBodyText = convertDbCommentTextBodyToUrlHtmlTags(commentBodyText);
            injectDbCommentData(dbComment, commentBodyText, grabViewerState);
            commentBodyText = convertDbCommentTextBodyMentionsToHtmlTags(commentBodyText);
        }

        var appComment = {};
        appComment['dbComment'] = dbComment;
        appComment['attachments'] = attachments;
        appComment['id'] = dbComment["id"];         // Redundant, TODO: Remove?
        appComment['uiId'] = getCommentUIId(dbComment);
        appComment['content'] = commentBodyText;
        appComment['node-offset'] = getCommentTag(dbComment, "nodeOffset");
        appComment['node-id'] = nodeId == null && appComment['node-offset'] ? -1 : nodeId;
        appComment['highlight-node-ids'] = selectedNodeIds.concat();
        appComment['lastPost'] = dbComment['published'] ? new Date(dbComment['published']).getTime()
                                                        : Number.MAX_VALUE;
        appComment['onCurrentSheet'] = isCommentFromCurrentSheet(appComment);
        appComment['serverStatus'] = serverDbComment ? Autodesk.Comments2.Constants.COMMENT_STATUS_SAVED_TO_DB
                                                     : Autodesk.Comments2.Constants.COMMENT_STATUS_AUTHORING;
        appComment['replies'] = [];
        appComment['thisVersion'] = bThisVersion;
        appComment['version'] = commentVersion;
        appComment['marker-controller'] = null;
        appComment['translated'] = false;
        // NOTE: appComment may be patched by the following methods:
        // - normalizeLoadedCommentsFromFusion
        // - 'onCurrentSheet' on updateAppCommentsCurrentSheet
        // - 'marker-controller' on addCommentEntryMarker

        // update the stored maxUI id
        mMaxUIId = Math.max(parseInt(appComment['uiId']), mMaxUIId);

        mCommentsPanel.onCreateAppComment(appComment);
        mCommentsViewer.onCreateAppComment(appComment);

        return appComment;
    }

    function translatedAppComment(appComment) {

        if (appComment['translated']) {
            return;
        }

        appComment['translated'] = true;
        var dbComment = appComment.dbComment;

        // Some comments from fusion come without 'isOrthographic' field.
        var viewport = dbComment['viewport'];
        if (viewport && !('isOrthographic' in viewport)) {
            viewport['isOrthographic'] = (viewport['projection'] !== 'perspective');
        }

        // Global offset transformation must be applied for LEGACY comments as well as
        // NEW (Fusion compatible) comments.
        var model = mCommentsViewer.viewer.model;
        var globalOffset =  model ? model.getData().globalOffset : null;
        if (globalOffset) {
            var invGlobalOffset = { x: -globalOffset.x, y: -globalOffset.y, z: -globalOffset.z };
            Autodesk.Comments2.LmvUtils.applyOffsetToCamera(viewport, invGlobalOffset);
        }
    }

    function createAppCommentReply(commentBodyText, parentAppComment) {
        return createAppCommentReplyAux(null, commentBodyText, parentAppComment);
    }

    function createAppCommentReplyFromDbComment(dbComment, parentAppComment) {
        return createAppCommentReplyAux(dbComment, null, parentAppComment);
    }

    function createAppCommentReplyAux(serverDbComment, commentBodyText, parentAppComment) {
        var isNewComment = true;
        var dbComment;
        if (serverDbComment) {
            // We are loading a dbData from server
            isNewComment = false;
            dbComment = serverDbComment;
            commentBodyText = convertDbCommentTextBodyMentionsToHtmlTags(dbComment['body']);
        } else {
            // New global comment. No need for viewer state.
            dbComment = {};
        }

        // A comment on the database is just a viewer state object with additional key/values
        // that are compliant with backend specifications.
        if (isNewComment) {
            commentBodyText = convertDbCommentTextBodyToUrlHtmlTags(commentBodyText);
            injectDbCommentData(dbComment, commentBodyText);
            commentBodyText = convertDbCommentTextBodyMentionsToHtmlTags(commentBodyText);
        }

        var appCommentReply = {};
        appCommentReply['dbComment'] = dbComment;
        appCommentReply['id'] = dbComment["id"];         // Redundant, TODO: Remove?
        appCommentReply['content'] = commentBodyText;
        appCommentReply['parent'] = parentAppComment;
        appCommentReply['lastPost'] = dbComment['published'] ? new Date(dbComment['published']).getTime()
            : Number.MAX_VALUE;
        appCommentReply['serverStatus'] = serverDbComment ? Autodesk.Comments2.Constants.COMMENT_STATUS_SAVED_TO_DB
            : Autodesk.Comments2.Constants.COMMENT_STATUS_AUTHORING;

        // add the reply to the parent's list of replies
        parentAppComment.replies.push(appCommentReply);

        mCommentsPanel.onCreateAppCommentReply(appCommentReply);

        return appCommentReply;
    }

    function getSelectedNodeIds(viewerState) {
        function toIntArray( array ) {
            var ret = [];
            if (Array.isArray(array)) {
                for (var i= 0, len=array.length; i<len; ++i) {
                    ret.push( parseInt(array[i]) );
                }
            }
            return ret;
        }
        function extractSelectedNodeIds( viewerState ) {
            if (viewerState && Array.isArray(viewerState.objectSet) && viewerState.objectSet.length > 0) {
                var objectSet = viewerState.objectSet[0];
                if (objectSet.idType === 'external') {
                    return objectSet.id.concat(); // shallow copy
                }
                // for lmv ids, make sure they are int ids.
                return toIntArray(objectSet.id);
            }
            return [];
        }

        return extractSelectedNodeIds(viewerState);
    }

    function createAppAttachmentsFromDbComment(dbComments) {
        if (!Array.isArray(dbComments.attachment)) {
            return []; // We need at least an empty array.
        }
        return dbComments.attachment.map(function(dbAttachment){
            var appAttachment = {
                type: dbAttachment.clazz,
                id: dbAttachment.id,
                data: null, // Needs to be fetched from OSS using ossPath below
                ossPath: dbAttachment.url,
                label: dbAttachment.name,
                dbAttachment: dbAttachment
            };
            return appAttachment;
        });
    }

	function createAppCommentRepliesFromAppComment(appComment) {
        if (!Array.isArray(appComment.dbComment.comment)) {
            return []; // We need at least an empty array.
        }
        return appComment.dbComment.comment.map(function(dbCommentReply){
            return createAppCommentReplyFromDbComment(dbCommentReply, appComment);
        });
    }

    /**
     *
     * @param appAttachmentThumbnail
     * @param attachmentDiv
     * @param {Boolean} [captureMarkers] True to capture markers.
     * @param {Boolean} [captureAnnotations] True to capture annotations.
     */
    function takeAndSendScreenCaptureAnimation(appAttachmentThumbnail, attachmentDiv, captureMarkers, captureAnnotations) {

        // Make sure the imageHolder has a default width.
        var viewerBounds = mViewerInstance.container.getBoundingClientRect();
        var vWidth = (viewerBounds.right - viewerBounds.left);
        var vHeight = (viewerBounds.bottom - viewerBounds.top);
        var widthToHeight = vWidth / vHeight;
        var placeholderWidth = Autodesk.Comments2.Constants.IMAGE_CAPTURE_THUMB_HEIGHT * widthToHeight;
        attachmentDiv.imageHolder.style.width = placeholderWidth + 'px';

        generateThumbnails(function onThumbnailReady(thumbnailData, captureMarkers, captureAnnotations) {

            var imageData = thumbnailData.imageData;
            var animStart = mCommentsViewer.viewer.container;
            var animEnd = attachmentDiv.imageHolder;

            appAttachmentThumbnail.data = imageData;

            // TODO: Find a clearer way to do this.
            // Fix:: Take snapshot while in annotation mode.
            if (captureAnnotations) {
                mCommentsViewer.cancelAnnotationsEditMode();
            }

            mCommentsPanel.animateScreenCapture(
                animStart,
                animEnd,
                thumbnailData
            );
        }, captureMarkers, captureAnnotations);
    }

    /**
     * Triggers the thumbnail generation.  There are 2 thumbnails generated:
     * 'big' and 'small'.  These 2 are passed back into the callback function grouped within an object.
     *
     * @param {Function} onThumbnailGenerationComplete - Callback for when all thumbnails have been generated.
     * @param {Boolean} [includeMarkers] True to include markers.
     * @param {Boolean} [includeAnnotations] True to include annotations.
     * @return {Object} with 2 attribute: 'big' and 'small'
     */
    function generateThumbnails(onThumbnailGenerationComplete, includeMarkers, includeAnnotations) {
        mCommentsViewer.screenCapture(function(base64String, imageWidth, imageHeight){
            var result = {
                imageData: base64String,
                imageWidth: imageWidth,
                imageHeight: imageHeight
            };
            onThumbnailGenerationComplete(result, includeMarkers, includeAnnotations);
        }, includeMarkers, includeAnnotations);
    }

    function pushTag(dbComment, tagObject) {
        if (!Array.isArray(dbComment["tags"])) {
            dbComment["tags"] = [];
        }
        dbComment["tags"].push(tagObject);
    }

    /**
     * Returns a value for a specified tag key. Null if key not found.
     *
     * @param {Object} dbComment - dbComment to inspect
     * @param {String} tagKey - tag we are looking for.
     * @returns {String|null} - String value associated to the tag, or null if not found.
     */
    function getCommentTag(dbComment, tagKey) {
        var tags = dbComment["tags"];
        if (tags && Array.isArray(tags)) {
            for (var i = 0, len = tags.length; i < len; ++i) {
                if (tags[i]["name"] === tagKey) {
                    return tags[i]["value"];
                }
            }
        }
        return null;
    }

    function gatherViewerExternalIds(dbComment, onComplete) {

        if (!Array.isArray(dbComment.objectSet) || dbComment.objectSet.length === 0) {
            onComplete();
            return;
        }

        // Avoid translating ids for 2d sheets (for now)
        if (mViewerInstance.model.is2d()) {
            onComplete();
            return;
        }

        var objectSetValues = dbComment.objectSet[0];
        var externalIds = {};
        var propCount = objectSetValues.id.length +
            objectSetValues.hidden.length +
            objectSetValues.isolated.length;
        var bExternalIdFound = false;

        // Nothing to do, move on.
        if (propCount === 0) {
            onComplete();
            return;
        }

        function fetchExternalId(nodeId){
            mViewerInstance.getProperties(nodeId,
                function(result) {
                    // onSuccess //
                    if ('externalId' in result) {
                        externalIds[nodeId] = result['externalId'];
                        bExternalIdFound = true;
                    }
                    propCount--;
                    if (propCount === 0) {
                        onPropsFetched(true);
                    }
                },
                function(error) {
                    // onError //
                    propCount--;
                    if (propCount === 0) {
                        onPropsFetched(false);
                    }
                }
            );
        }
        function mapIdToExternalId(nodeId) {
            return externalIds[nodeId];
        }
        function onPropsFetched(sucess) {

            // If no external ids found, proceed to onComplete.
            if (!bExternalIdFound || !sucess) {
                onComplete();
                return;
            }

            // Set the external ids back into the dbComment object
            objectSetValues.id = objectSetValues.id.map(mapIdToExternalId);
            objectSetValues.hidden = objectSetValues.hidden.map(mapIdToExternalId);
            objectSetValues.isolated = objectSetValues.isolated.map(mapIdToExternalId);

            // Need to set/change the idType to 'external'
            objectSetValues['idType'] = 'external';

            // Push copy to objectSet
            dbComment.objectSet.push(objectSetValues);

            onComplete();
        }

        // Make a copy of the original object:
        objectSetValues = JSON.parse(JSON.stringify(objectSetValues));

        // Map them all!
        objectSetValues.id.forEach(fetchExternalId);
        objectSetValues.hidden.forEach(fetchExternalId);
        objectSetValues.isolated.forEach(fetchExternalId);
    }

    function addCommentEntryMarker(appComment) {

        if (!Autodesk.Comments2.LmvUtils.isValidNodeDbId(appComment['node-id'])) {
            return;
        }
        if (appComment['marker-controller']) {
            return;
        }

        appComment['marker-id'] = "marker-" + appComment.uiId;
        var commentMarker = mCommentsPanel.appendCommentMarker(appComment);
        appComment['marker-controller'] = new Autodesk.Comment.Marker(
            appComment.uiId,
            null,
            commentMarker
        );
    }

    function getCommentUIId(dbComment) {
        if("index" in dbComment) {
            return dbComment["index"];
        }
        else {
            return ++mMaxUIId;
        }
    }

    function toggleAppComment(appComment) {
        if (mSelectedComment === appComment) {
            clearSelectedSnapshot();
            mSelectedComment = null;
        } else {
            selectAppComment(appComment);
        }
    }

    function selectAppComment(appComment) {
        if (mSelectedComment === appComment) {
            return;
        }

        if (mSelectedComment) {
            clearSelectedSnapshot();
        }
        if(appComment){
            mCommentsPanel.setCommentEntryActive(appComment, true);
            restoreCommentSnapshot(appComment);
        }
        mSelectedComment = appComment;
    }

    /**
     * Selects and restores the default comment specified in settings.commentId
     * @private
     */
    function selectDefaultComment() {
        if (!mPendingSelectDefaultComment || !settings || !settings.commentId) {
            return;
        }
        var defaultComment;
        for (var i = 0, len = mAppCommentList.length; i < len; ++i) {
            var appComment = mAppCommentList[i];
            if (appComment.id === settings.commentId) {
                defaultComment = appComment;
                break;
            } else {
                // check replies!
                appComment['replies'].forEach(function(appCommentReply){
                    if (appCommentReply.id === settings.commentId) {
                        defaultComment = appComment; // Set the parent comment, not the reply.
                    }
                });
                if (defaultComment) {
                    break;
                }
            }
        }
        if (!defaultComment) {
            mPendingSelectDefaultComment = false;
            return;
        }
        if (!mCommentsViewer.canRestoreComment()) {
            // No need to reset flag
            return;
        }
        if (isCommentFromCurrentSheet(defaultComment)) {
            mPendingSelectDefaultComment = false;
            selectAppComment(defaultComment);
            mCommentsPanel.scrollToComment(defaultComment);
        }
        else
        {
            if (settings.openCommentGeometryForViewable) {
                settings.openCommentGeometryForViewable(defaultComment.dbComment.layoutName);
            }
        }
    }

    /**
     * Highlights a node associated with a comment.
     * If the comment is for a node, draws a line from the node the comment is attached to to the DOM element provided.
     * If the comment is for the entire model, highlights the entire model
     * @param {Object} appComment - Comment data.
     * @private
     */
    function drawCommentLine(appComment) {

        if (!mCommentsViewer.isModelLoaded()){
            return;
        }

        var xPos = -0.5; // outside the canvas.
        var yPos = mCommentsPanel.getCommentMarkerY(appComment);

        if (appComment['marker-id'] !== null) {

            mCommentsViewer.markers.setLineToMarker("line-" + appComment.id, appComment["marker-id"], xPos, yPos);
            mDrawingCommentLine = true;
            updateMarkersVisibility();
        }
    }

    /**
     * Removes any highlight associated with a comment.
     * @param {Object} appComment Comment data.
     * @private
     */
    function hideCommentLine(appComment) {

        if (!mCommentsViewer.isModelLoaded()){
            return;
        }

        // stop the comment line update calls
        mAllowCommentLineUpdate = false;

        if (appComment['marker-id'] !== null) {
            mCommentsViewer.markers.removeLine("line-" + appComment.id);
            mDrawingCommentLine = false;
            updateMarkersVisibility();
        }
    }

    function setNewCommentFocus(focused) {

        if (!mCommentsViewer.isModelLoaded()){
            mDrawingLinePostNewComment = false;
            updateMarkersVisibility();
            return;
        }

        if (!focused) {
            hideNewCommentLine();
            return;
        }

        // if an appComment is selected, unselect it since the focus is now on the new comment
        selectAppComment(null);

        // TextField is focused.  Attempt to signal what element from the viewer
        // will the comment be associated to.

        // markup-tool active?

        // Pin-tool information available?
        if (mCommentsViewer.pinToolSelection) {
            drawNewCommentLine({
                lineTo: "pinPoint",
                nodeId: mCommentsViewer.pinToolSelection.selectedNodeId,
                offset: mCommentsViewer.pinToolSelection.selectedNodeOffset
            });
            return;
        }

        // Any selected nodes? (3d only)
        if (!mViewerInstance.model.is2d()) {
            var selectedNodes = mCommentsViewer.viewer.viewerState.getSelectedNodes();
            if (selectedNodes.length > 0) {
                drawNewCommentLine({
                    lineTo: "node",
                    nodeId: selectedNodes[0],
                    offset: null
                });
                //return;
            }
        }
    }

    function drawNewCommentLine (drawCommand) {

        if (!Autodesk.Comments2.featureEnabled(settings, "markups")) {
            return;
        }
        if (!mCommentsViewer.isModelLoaded()){
            return;
        }

        var xPos = -0.5; // outside the canvas.
        var yPos = mCommentsPanel.getNewCommentTextareaY();

        switch (drawCommand.lineTo) {
            case "pinPoint":
            case "node":
                // For 'pinPoint' nodeId is -1.
                mCommentsViewer.markers.setLine("line-new-comment", drawCommand.nodeId, xPos, yPos, drawCommand.offset);
                break;
        }

        mDrawingLinePostNewComment = true;
        updateMarkersVisibility();
        selectAppComment(null);
    }

    function hideNewCommentLine() {

        if (!Autodesk.Comments2.featureEnabled(settings, "markups")) {
            return;
        }
        if (!mCommentsViewer.isModelLoaded()){
            return;
        }

        // stop the comment line update calls
        mAllowCommentLineUpdate = false;

        if (mDrawingLinePostNewComment) {
            mCommentsViewer.markers.removeLine("line-new-comment");
            mDrawingLinePostNewComment = false;
            updateMarkersVisibility();
        }
    }

    /**
     * Adds an interval to update the comment's position and line while it is animating.
     * @param {Object} appComment Comment data.
     * @private
     */
    function addCommentAnimationUpdateInterval(appComment) {
        // TODO: Get the css transition duration from javascript.
        var transitionDuration = 400;
        var interval = 30;
        var totalTime = 0;

        var animationStep = function(){
            if(mSelectedComment !== appComment) {
                mAllowCommentLineUpdate = false;
                return;
            }

            mCommentsPanel.fitCommentDivInPanel(appComment);
            drawCommentLine(appComment);
            totalTime += interval;
            if (mAllowCommentLineUpdate && (totalTime < transitionDuration)) {
                window.requestAnimationFrame(animationStep);
            }
        };

        mAllowCommentLineUpdate = true;
        window.requestAnimationFrame(animationStep);
    }

    /**
     * Restores a viewer state associated with a comment. Also replaces selected nodes with the highlights used for
     * comments.
     * @param {Object} appComment - App Comment to restore.
     * @private
     */
    function restoreCommentSnapshot(appComment) {

        var markerController = appComment['marker-controller'];
        markerController && markerController.setActive(true);

        // Allow the comment to be selected (and thus expanded)
        // even when the viewer is not ready to fully restore a snapshot.
        // When the viewer finishes loading, it will look into the selectedComment
        // and restore it.
        if (!mCommentsViewer.canRestoreComment()){
            return;
        }

        if (isCommentFromCurrentSheet(appComment)) {
            if (mCommentsViewer.isViewerCompatible(mCommentsViewer.viewer)) {

                // Only load comments from the current version.
                if (appComment['thisVersion']) {
                    var viewerStateTransitionInitiatedByPanel = true;
                    translatedAppComment(appComment);
                    mCommentsViewer.restoreState(appComment, viewerStateTransitionInitiatedByPanel);
                    mCommentsViewer.replaceSelectionWithCommentHighlights(appComment);
                    drawCommentLine(appComment);
                    mCommentsViewer.setCommentGeometryHighlight(appComment);
                    updateMarkersVisibility();
                }
            }
        } else {
            if (settings.openCommentGeometryForViewable) {
                settings.openCommentGeometryForViewable(appComment.dbComment.layoutName);
            }
        }
        addCommentAnimationUpdateInterval(appComment);
    }

    function clearSelectedSnapshot() {
        if (mSelectedComment) {
            mCommentsPanel.setCommentEntryActive(mSelectedComment, false);

            hideCommentLine(mSelectedComment);
            mCommentsViewer.clearCommentGeometryHighlight(mSelectedComment);
            mCommentsViewer.exitMarkupModes();
            onEscapeCreateMarkups();

            var markerController = mSelectedComment['marker-controller'];
            markerController && markerController.setActive(false);
            mSelectedComment = null;

            updateMarkersVisibility();
        }
    }

    /**
     * Shows markers for the currently selected sheet only and hides the rest of the markers for the document.
     * @private
     */
    function showCurrentSheetMarkers() {
        if (!mCommentsViewer.viewer) {
            return;
        }
        mAppCommentList.forEach(function(appComment){
            if (isCommentFromCurrentSheet(appComment)) {
                if (!appComment['markerTranslated']) {
                    appComment['markerTranslated'] = true;
                    translateMarker(appComment);
                }
                mCommentsViewer.addCommentMarkerToViewer(appComment);
            }
        });
    }

    function translateMarker(appComment) {

        if (!mViewerInstance || !mViewerInstance.model) {
            return;
        }
        var mData = mViewerInstance.model.getData();
        if (!mData || !mData.globalOffset){
            return;
        }

        // Given changes in how the pinTool saves data currently, we need to make
        // sure that legacy data gets transformed accordingly.
        if (appComment["node-offset"] && isTagVersionLessThan(appComment.dbComment, 3)) {

            var vector3 = mViewerInstance.viewerState.getVector3FromArray(appComment["node-offset"], null);
            var v3convert = Autodesk.Viewing.Extensions.Markers.convertOffset(
                vector3, appComment['node-id'], mViewerInstance
            );

            // In some old comments, the pin tool may end up giving us an offset from the origin
            // instead of from a specific node id.  In those cases, take into account the globalOffset.
            if (appComment['node-id'] === -1) {
                var goff = mData.globalOffset;
                v3convert.x -= goff.x;
                v3convert.y -= goff.y;
                v3convert.z -= goff.z;
            }

            appComment["node-offset"] = v3convert.toArray();
        }
    }

    /**
     * Updates visibility of in-viewer markers.
     * Takes into account settings.markersAlwaysVisible (when available)
     */
    function updateMarkersVisibility() {

        var renderMarkers = !mCommentsPanel.isVisible();
        if (settings) {
            renderMarkers = renderMarkers || settings.markersAlwaysVisible;
        }

        // Check if any framed tool is active
        renderMarkers = renderMarkers && (mCommentsViewer.pinTool ? !mCommentsViewer.pinTool.editMode : true);
        renderMarkers = renderMarkers && (mCommentsViewer.viewerSelector ? !mCommentsViewer.viewerSelector.editMode : true);
        renderMarkers = renderMarkers && (mSelectedComment === null);
        renderMarkers = renderMarkers && (!mDrawingLinePostNewComment);

        mCommentsViewer.setMarkersVisible(renderMarkers);
    }

    function updatePinToolVisibility() {
        if (!mCommentsPanel.isVisible()) {
            if (mCommentsViewer.pinTool && mCommentsViewer.pinTool.enablePinTool) {
                mCommentsViewer.pinTool && mCommentsViewer.pinTool.enablePinTool(false);
            }
        }
    }

    if (settings.exportGlobal) {
        window.CO2 = {
            getCommentList: function() { return mAppCommentList.concat(); },
            getLmvInstance: function() { return mViewerInstance; },
            getViewingApp: function() { return mViewingApp; },
            dumpComments: function() {
                var dbCommentList = mAppCommentList.map(function(appComment){
                    return appComment.dbComment;
                });
                return JSON.stringify(dbCommentList);
            }
        };
    }

    //////////////////////
    // Public interface //
    //////////////////////
    return {
        initialize: initialize,
        destroy: destroy,
        setVisible: setVisible,
        updateHeight: updateHeight,
        setToken: setToken,
        setViewingApp: setViewingApp,
        setViewerAux: setViewer,
        setGeometryItems: setGeometryItems,
        refreshComment: refreshComment,
        decodeText: decodeText
    };
};
namespaceFunction('Autodesk.Comments2');

(function() {
// Begin closure

    'use strict';

    /**
     * @class
     * Comments Panel is a UI control that adds itself as a child of a dom element passed in.
     * Comments Panel will interact with the viewer instance as well as a commenting backend
     * to store commenting information.
     *
     * @constructor
     * @param {Object} args - Arguments for Comments Panel construction
     * @param {Autodesk.Viewing.Viewer} args.viewer
     * @param {HTMLElement|string} args.parentContainer - Or parentContainerId
     * @param {Object} args.settings - customizable parameters passed in by hosting application
     * @param {String} args.settings.urn - id of the file (document) being viewed. Used as the identifier to group comments
     *                                in backend.
     * @param {String} args.settings.version - the current version of the document
     * @param {String} args.settings.oauth2token - 3 legged oauth2 token to access the backend.
     * @param {String} [args.settings.messageOverlayZIndex] - Overrides the zIndex style property used for the popup dialogs
     *                                                 (confirm comment delete, url input).
     * @param {Function} [args.settings.openCommentsPanel] - Function that signals that the comments panel needs to be opened.
     * @param {Function} [args.settings.openCommentGeometryURN] - DEPRECATED.
     * @param {Function} [args.settings.openCommentGeometryForViewable] - Function that signals that a viewable different than
     *      the current one needs to be loaded before restoring the state associated to the comment.
     * @param {Function} [args.settings.postCommentCallback] - Function that signals that a comment has been posted to the
     *                                                    commenting backend.
     * @param {Function} [args.settings.textInputFormatFunc] - Function that takes in a TextArea object. When provided,
     *                                                    every text area created for commenting (make comment, reply
     *                                                    comment) will be passed to this function for external hooks.
     * @param {String} [args.settings.env] - String, one of the following values ['Local', 'Development', 'Staging',
     *                                 'Production', 'AutodeskDevelopment', 'AutodeskStaging', 'AutodeskProduction'].
     *                                  Defaults to Development.
     * @param {String} [args.settings.commentId] - Id of the comment that should be selected by default. It's viewer state will
     *                                        get restored as well.
     * @param {Boolean} [args.settings.isOwner] - Whether the user owns the item we are commenting on.  Allows him to delete
     *                                       any comment posted.
     * @param {String} [args.settings.oxygenId] - The oxygenId of the user using the comments panel.
     * @param {String} [args.settings.displayName] - Display name of the user.  If none, backend populates it with Oxygen's full name.
     * @param {String} [args.settings.avatarUrl] - Url to the user's thumbnail image.
     * @param {String[]} [args.settings.features] - An array of String ids for what features are present in the panel.
     *                                         A null value signals to load ALL the features, no limitations.
     *                                         An empty array signals to load NO feature at all.  Adding values to the
     *                                         array will activate the features.  Possible values are:
     *  - 'markups' - Button to initiate markup flows.
     *  - 'filters' - Enables filtering options.
     *  - 'attachments' - Enables uploading attachments.
     *  - 'snapshot' - Enables taking and uploading snapshots
     * @param {Boolean} [args.settings.fakeServer] - Boolean, whether we want to use a fake server or not. Use only in non-dev
     *                                       environment to test UI without an operational backend.
     * @param {Boolean} [args.settings.fakeServerDelay] - Simulates a server response delay (in milliseconds)
     * @param {Function} [args.settings.log] - Function that routes all logging done by the panel.  Sends a String message
     *                                    as the one and only argument.
     *
     * @example
     *      var myOpenCommentsFunction = function() {
 *          // Application hosting the comments panel may want to operate
 *          // on divs and change their sizes/visibilities.
 *      };
     *      var myOpenCommentGeometryForViewable = function(viewableId) {
 *          // Application hosting the comments panel will want to
 *          // load the viewable with id viewableId.
 *      };
     *      var myPostCommentCallback = function(dbComment) {
 *          // dbComment is the object stored in the backend,
 *          // containing the viewerState, the text and user information.
 *      };
     *      var myLogFunction = function(message) {
 *          // A simple implementation may just push messages to console.log
 *          console.log(message);
 *      };
     *      var settings = {
 *          urn: 'urn:dXJuOmFkc2suczM6ZGVyaXZlZC5maWxlOlZpZXdpbmdTZXJ2aWNlVGVzdEFwcC91c2Vycy9NaWNoYWVsX0hhbmAvQVZFTlRBRE9SIExQNzAwLmYzZA',
 *          oauth2token: 'xNNYzxWownNe7zUvW51il3s7VwOQ',
 *          openCommentsPanel: myOpenCommentsFunction,
 *          messageOverlayZIndex: '999999',
 *          openCommentGeometryForViewable: myOpenCommentGeometryForViewable,
 *          postCommentCallback: myPostCommentCallback,
 *          userId: 'DJFHIENKDUIJJL',
 *          displayName: 'John Doe',
 *          avatarUrl: 'http://cdn.site.com/img/JohnDoe.png',
 *          features: ['markups', 'filters'],
 *          env: 'Development',
 *          fakeServer: false,
 *          log: myLogFunction,
 *          isOwner: false
 *      };
     *      var args = {
 *          viewer: null,
 *          parentContainer: 'parentDiv',
 *          settings: settings
 *      };
     *      var commentsPanel = new Autodesk.Comment2.CommentPanel( args );
     *      ...
     *
     */
    Autodesk.Comments2.CommentPanel = function(args) {

        // Extract attributes I care about.
        var viewer = args.viewer;
        var parentContainer = args.parentContainer;
        var settings = args.settings;

        var FRAMED_TOOLS = {
            object: { name: Autodesk.Comments2.Constants.FRAMED_TOOL_OBJECT,
                tooltip: "object_tooltip",
                buttonName: "objectButton",
                buttonInst: null,
                styleIdle: "commentPanel-toolButton commentPanel-toolButton-object",
                styleActive: "commentPanel-toolButton commentPanel-toolButton-object active" },

            point: { name: Autodesk.Comments2.Constants.FRAMED_TOOL_POINT,
                tooltip: "point_tooltip",
                buttonName: "pointButton",
                buttonInst: null,
                styleIdle: "commentPanel-toolButton commentPanel-toolButton-point",
                styleActive: "commentPanel-toolButton commentPanel-toolButton-point active" }
        };
        var AVAILABLE_FRAME_TOOLS = [
            FRAMED_TOOLS.object,
            FRAMED_TOOLS.point
        ];

        // animations
        var ANIMATE_IN = "animateIn";

        // Events
        this.EVENT_COMMENTS2_CHANGE_PANEL_VISIBILITY = 'EVENT_COMMENTS2_CHANGE_PANEL_VISIBILITY';
        this.EVENT_COMMENTS2_CLICK_COMMENT_ENTRY = 'EVENT_COMMENTS2_CLICK_COMMENT_ENTRY';
        this.EVENT_COMMENTS2_REQUEST_SELECT_COMMENT_ENTRY = 'EVENT_COMMENTS2_REQUEST_SELECT_COMMENT_ENTRY';
        this.EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT = 'EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT';
        this.EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT_REPLY = 'EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT_REPLY';
        this.EVENT_COMMENTS2_FILTER_CHANGED_CURRENT_SHEET = 'EVENT_COMMENTS2_FILTER_CHANGED_CURRENT_SHEET';
        this.EVENT_COMMENTS2_FILTER_CHANGED_VERSION = 'EVENT_COMMENTS2_FILTER_CHANGED_VERSION';
        this.EVENT_COMMENTS2_SORT_CHANGED = 'EVENT_COMMENTS2_SORT_CHANGED';
        this.EVENT_COMMENTS2_REQUEST_DELETE_COMMENT = 'EVENT_COMMENTS2_REQUEST_DELETE_COMMENT';
        this.EVENT_COMMENTS2_REQUEST_DELETE_COMMENT_REPLY = 'EVENT_COMMENTS2_REQUEST_DELETE_COMMENT_REPLY';
        this.EVENT_COMMENTS2_REMOVE_ATTACHMENT = 'EVENT_COMMENTS2_REMOVE_ATTACHMENT';
        this.EVENT_COMMENTS2_CLICK_FRAMED_TOOL = 'EVENT_COMMENTS2_CLICK_FRAMED_TOOL';
        this.EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT = 'EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT';
        this.EVENT_COMMENTS2_ENTER_COMMENT_MARKER = 'EVENT_COMMENTS2_ENTER_COMMENT_MARKER';
        this.EVENT_COMMENTS2_LEAVE_COMMENT_MARKER = 'EVENT_COMMENTS2_LEAVE_COMMENT_MARKER';
        this.EVENT_COMMENTS2_FOCUS_CHANGE_NEW_COMMENT = 'EVENT_COMMENTS2_FOCUS_CHANGE_NEW_COMMENT';
        this.EVENT_COMMENTS2_SCROLL_COMMENT_ENTRIES = 'EVENT_COMMENTS2_SCROLL_COMMENT_ENTRIES';
        this.EVENT_COMMENTS2_REQUEST_CHANGE_SHEET = 'EVENT_COMMENTS2_REQUEST_CHANGE_SHEET';
        this.EVENT_COMMENTS2_REQUEST_SNAPSHOT = 'EVENT_COMMENTS2_REQUEST_SNAPSHOT';

        // img_user_generic.png
        this.DEFAULT_USER_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0VCQzYyMjQ0NzYxMTFFNDlDMjVEODI2MkM2OUJERDgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0VCQzYyMjU0NzYxMTFFNDlDMjVEODI2MkM2OUJERDgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozRUJDNjIyMjQ3NjExMUU0OUMyNUQ4MjYyQzY5QkREOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRUJDNjIyMzQ3NjExMUU0OUMyNUQ4MjYyQzY5QkREOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpTy0N0AAAOiSURBVHja7JlLT/JAFIYF6iUCESUSMCaAe///n3DHzoULxUtEDcpdQb7n4yQn47SFKUwNCyexGdpOzzvvuY+Zq6urnW0aAX+Xl5dbgqbVamV3tmz8AfoD5MPL1h5fX1+DweDj42M4HM5ms0wmc3BwcHp6WiwWfxXQZDIZj8fdbhcocmc+n39/fzMBFjfL5XK1Wt3d3f0NQE9PT6+vr8IHV6AwmS+GIOP6/v7e6/Vqtdrx8XG6gNh9p9OZTqci24TCkJ9M5IV2uw2s8/PzbDabilHDx93dneIIv6A3UR9zYPX7/fv7+7S8DGXJ7sVcRHAYjQ5wf35+Ympo0D+g0WiE6eBWiBFhelXxFlsCkfss9A/o8fFRNcUkjhvTnlRxWB478QmIMMNHxadkxHGjc31HIKI7n4BkrypPaYjkJnIeBIFPQMRfXNdUxxJuwvbEyOVyPgGBhrBrhhN3bnKL4dmoM4uRlBudsxnPDOEpuImVH1x4kiV4g2cvIwipfyXiSXMLIdsnoMPDQ0ukuw2xCoILhYJnG7LCj7sNSQh1z68JcpkZ9By5WZLpNgUkW0xkQ/qyWaL4AYTTYgRcgaUhwIVOrsRo1rpXj64MnZycaLC2clnk4B0l9ezszGUPyQAdHR3t7+9rfFupAkEAMXt7e/l83n/5gYCLiwtgIWClywga0AOFVWlVjOCgaI8r0MKphkFLxAZSbBRpuAiSaqFxiiP28A41gkTUFAGx6UajAU+oYwk9eBZoms2muy1v1ErjNYjMLkakZnlar9cTVR2b9vZWeRS26ES92KaApHHW9tm0J4lV1qMUAYlUhEl5FJkupAASQO4ZY32j5vry8oI8pIZ9TXBoL7aGUQeOrMinx+Pxw8MD1ZagCWd1bcc6nc5gMMD8Tc93yTmBIyvo6O3tDTHS+4W/K8Iktwsm6szr62uSYLlcBlY4K0fiC+LOFaSHZw2s9Ho9GkUWaysdh1tlSKHITxp7dgKg/GIQuHkUbmNiAfGV5+dnxINDFzCx2larHLNqN7PCFAPnazSvINP7pOpSqVSpVKwd/gDEmpubG9Yz0W5VCIs8dllemkkI0JM1/aAAAiLOgZ1ZAf1H73d7ewtD2oebfU/k6cLyEtY6yBJASrD0RsCyDpCy5ukYZiiHX2HxppqSttIWo+Y5BJuHp+FwGAEIBZuF88oOcI2WyCRed0jiMw+QArVliS7hgjyuA3RvpZfYmehOT3P/P922f0/9E2AAY95XyW2AYu8AAAAASUVORK5CYII=";

        this.settings = settings;
        this.commentDataList = [];
        this.tooltips = {};
        this.viewerStateTransitionInitiatedByPanel = false;
        this.viewerToolbarCommentBtn = null;
        this.focusOutTimeout = null;
        this.activeFramedTool = null;
        this.sheetGuidLabelMap = null;
        var self = this;

        this.locStrings = args.locStrings;

        // setup() will add the following methods:
        // - addEventListener
        // - hasEventListener
        // - removeEventListener
        // - fireEvent
        // as well as the member variable:
        // - this.listeners = []
        Autodesk.Comments2.addTrait_eventDispatcher(this);

        /**
         * Function used by the comments panel to print out information.
         * Can be routed to an external function by providing a 'log' function within the settings object.
         *
         * @param {String} message - the message to print out to the console.
         * @private
         */
        this.log = function(message) {
            if (this.settings && this.settings.log) {
                this.settings.log(message);
            }
            // console.log(message); // local testing.
        };

        /**
         * Initializes the comments panel, which includes steps like:
         * - Fetch comments from commenting service.
         * - Create and add DOM structure to page.
         * - Sets the viewer instance (if any at this point).
         */
        this.initialize = function() {

            this.buildPanel(parentContainer);

            var zIndex = null;
            if (this.settings.messageOverlayZIndex !== undefined) {
                zIndex = this.settings.messageOverlayZIndex;
            }
            var root = document.getElementsByTagName("body")[0];
            this.messageOverlay = new Autodesk.Comment.MessageOverlay(root, zIndex, this.locStrings);
        };

        /**
         * Notifies that the document has multiples sheets
         */
        this.setHasMultipleSheets = function() {
            this.sheetFilterelements.radioGroup.style.display = "block";
            this.sheetFilterelements.divider.style.display = "block";
        };

        /**
         * Constructs the panel UI.
         * @param {HTMLElement|string} parentContainer Parent container or parent container id.
         */
        this.buildPanel = function(parentContainer) {

            var eventManager = new Autodesk.Comment.EventManager();
            var parentContainerId;
            if (typeof parentContainer === 'string') {
                parentContainerId = parentContainer;
                parentContainer = document.getElementById(parentContainerId);
            } else {
                parentContainerId = parentContainer.id || "";
            }
            this.parentContainer = parentContainer;

            this.wrapper = document.createElement('div');
            this.wrapper.className = "commentPanel-wrapper";
            parentContainer.appendChild(this.wrapper);

            this.rootContainer = document.createElement('div');
            this.rootContainer.className = "commentPanel-container";
            this.wrapper.appendChild(this.rootContainer);

            var commentBoxContainer = document.createElement('div');
            commentBoxContainer.className = 'commentPanel-post-container';

            var newPostTxtAreaDivId = this.getNewPostTextAreaId();
            var stringData = {
                buttonPost: this.locStrings["post_new_comment"],
                buttonCancel: this.locStrings["button_cancel"],
                defaultText: this.locStrings["default_textarea_message"]
            };
            var canAddAttachments = Autodesk.Comments2.featureEnabled(this.settings, "attachments");
            var canTakeSnapshot = Autodesk.Comments2.featureEnabled(this.settings, "snapshot");
            var hasCancelButton = false;
            var postDivOptions = {
                isReply: false,
                canAddAttachments: canAddAttachments,
                canTakeSnapshot: canTakeSnapshot,
                hasCancelButton: hasCancelButton
            };
            var divData = this.createPostDiv(newPostTxtAreaDivId, stringData, postDivOptions);

            // Since IE-10 does not support pointer-event none, we thus propagate the focus event from
            // the "placeholder text" onto the text area beneath.
            eventManager.addEventListener(divData.defaultTextarea, 'click', function(){
                divData.textarea.focus();
            });

            // Markup Buttons
            var commentMarkupContainer = document.createElement('div');
            commentMarkupContainer.className = "commentPanel-markup-container";

            var addCommentSpan = document.createElement('span');
            addCommentSpan.className = "commentPanel-title-span";
            addCommentSpan.innerHTML = this.locStrings["add_comment"];
            commentMarkupContainer.appendChild(addCommentSpan);

            var buttonTypes = Autodesk.Comments2.featureEnabled(this.settings, "markups") ? AVAILABLE_FRAME_TOOLS : [];
            if (buttonTypes.length) {
                buttonTypes.map(function(toolData) {
                    var button = toolData.buttonInst = self.createElement("input", "submit", toolData.styleIdle);
                    self.addTooltip(button, self.locStrings[toolData.tooltip], eventManager);
                    divData.bottom.appendChild(button);
                });

                eventManager.addEventListener(FRAMED_TOOLS.object.buttonInst, "click", function (event) {
                    self.onFramedToolClick(FRAMED_TOOLS.object);
                });

                eventManager.addEventListener(FRAMED_TOOLS.point.buttonInst, "click", function (event) {
                    self.onFramedToolClick(FRAMED_TOOLS.point);
                });
            }

            commentBoxContainer.appendChild(commentMarkupContainer);

            if (this.settings && this.settings.customFormatPostCommentSection) {
                this.settings.customFormatPostCommentSection(divData, true);
            }

            var commentContainers = [commentBoxContainer];
            var commentPostParts = [];

            // status bar
            var filterContainer;
            filterContainer = document.createElement('div');
            filterContainer.className = "commentPanel-filter-container";

            var filterContainerStatusSpan = document.createElement('span');
            filterContainerStatusSpan.className = "commentPanel-filter-span commentPanel-filter-span-status";

            var filterContainerOptionsSpan = document.createElement('span');
            filterContainerOptionsSpan.className = "commentPanel-filter-span commentPanel-filter-span-options";
            filterContainerOptionsSpan.innerHTML = this.locStrings["options"];
            this.filterContainerOptionsSpan = filterContainerOptionsSpan;
            var filterContainerOptionsImg = document.createElement('div');
            this.filterContainerOptionsImg = filterContainerOptionsImg;
            filterContainerOptionsImg.className = "commentPanel-filter-container-right-image";

            this.appendMultiple(filterContainer, [filterContainerOptionsImg, filterContainerOptionsSpan, filterContainerStatusSpan]);

            // filter overlay
            var filterOverlay = document.createElement("div");
            filterOverlay.className = "commentPanel-filterOverlay";

            var i, len;
            var createRadioButton = function(data, groupName, onChangeFunction) {
                var radioInput = document.createElement('input');
                var id = groupName + "_" + data.value;
                radioInput.id = id;
                radioInput.className = "commentPanel-filterOverlay-radio";
                radioInput.setAttribute('type', 'radio');
                radioInput.setAttribute('name', groupName);
                radioInput.setAttribute('value', data.value);
                if (data.checked) {
                    radioInput.setAttribute('checked', 'checked');
                }

                var radioLabel = document.createElement("Label");
                radioLabel.className = "commentPanel-filterOverlay-label";
                radioLabel.setAttribute("for", id);
                radioLabel.innerHTML = data.label;

                eventManager.addEventListener(radioInput, "change", onChangeFunction);
                return [radioInput, radioLabel];
            };
            var createRadioGroup = function(title, groupName, options, onChangeFunction) {
                var groupDiv = document.createElement('div');
                groupDiv.className = "commentPanel-filterOverlay-group";
                var titleSpan = document.createElement('span');
                titleSpan.className = "commentPanel-filterOverlay-title";
                titleSpan.innerHTML = title;

                var groupParts = [titleSpan];
                for(i = 0, len = options.length; i < len; ++i) {
                    groupParts = groupParts.concat(createRadioButton(options[i], groupName, onChangeFunction));
                }
                self.appendMultiple(groupDiv, groupParts);
                return groupDiv;
            };

            var createGroupDivider = function() {
                var dividerDiv = document.createElement('div');
                dividerDiv.className = "commentPanel-filterOverlay-divider";
                return dividerDiv;
            };

            var filterCloseButton = self.createElement("input", "submit",
                "commentPanel-imageButton commentPanel-imageButton-delete commentPanel-close-filter");

            var filterOverlayParts = [filterCloseButton];

            // Sheet filtering.
            // Hidden by default, gets visible through setHasMultipleSheets()
            var filterCurrentSheetOptions = [
                { value: false, label: this.locStrings["all_sheets"], checked:true },
                { value: true, label: this.locStrings["this_sheet"], checked:false }
            ];
            var radioGroup = createRadioGroup(this.locStrings["show_comments_on"], "bySheet", filterCurrentSheetOptions,
                function (event) {
                    var currentSheetOnly = (this.value === "true");
                    self.fireEvent({ type: self.EVENT_COMMENTS2_FILTER_CHANGED_CURRENT_SHEET, value: currentSheetOnly });
                });
            radioGroup.style.display = "none";
            filterOverlayParts.push(radioGroup);
            var divider = createGroupDivider();
            divider.style.display = "none";
            filterOverlayParts.push(divider);
            this.sheetFilterelements = {
                radioGroup: radioGroup,
                divider: divider
            };

            // Only add version filtering when dealing with a versioned document.
            var addVersionFilter = true;
            if (this.settings && this.settings.version < 2) {
                addVersionFilter = false;
            }
            if (addVersionFilter) {
                var filterVersionOptions = [
                    {
                        value: Autodesk.Comments2.Constants.FILTER_VERSION_ANY,
                        label: this.locStrings["all_versions"],
                        checked: true
                    },
                    {
                        value: Autodesk.Comments2.Constants.FILTER_VERSION_CURRENT,
                        label: this.locStrings["this_version"],
                        checked: false
                    }
                ];
                filterOverlayParts.push(createRadioGroup(this.locStrings["show_comments_on"], "byVersion", filterVersionOptions,
                        function(event){
                            var version = this.value;
                            self.fireEvent({ type: self.EVENT_COMMENTS2_FILTER_CHANGED_VERSION, value: version });
                        })
                );
                filterOverlayParts.push(createGroupDivider());
            }

            // Sorting options are always visible
            var sortOptions = [
                {
                    value: Autodesk.Comments2.Constants.SORT_OLDER_ON_TOP,
                    label: this.locStrings["sort_oldest"],
                    checked: false
                },
                {
                    value: Autodesk.Comments2.Constants.SORT_NEWER_ON_TOP,
                    label: this.locStrings["sort_most_recent"],
                    checked: true
                }
            ];
            filterOverlayParts.push(createRadioGroup(this.locStrings["sort_comments"], "sortBy", sortOptions,
                    function(event){
                        var sortStrategy = this.value;
                        self.fireEvent({ type: self.EVENT_COMMENTS2_SORT_CHANGED, value: sortStrategy });
                    })
            );

            this.filterOverlay = filterOverlay;
            this.filterButton = divData.filterButton;
            this.filterStatusSpan = filterContainerStatusSpan;
            this.filterStatusSpan.innerHTML = this.locStrings["loading_comments"];
            this.filterContainer = filterContainer;
            commentContainers.push(filterContainer, filterOverlay);

            self.appendMultiple(filterOverlay, filterOverlayParts);
            commentPostParts.push(filterOverlay);

            eventManager.addEventListener(filterContainerOptionsImg, "click", function (event) {
                self.setFilterOverlayVisible();
            });

            eventManager.addEventListener(filterCloseButton, "click", function(event) {
                self.setFilterOverlayVisible(false);
            });

            eventManager.addEventListener(filterOverlay, "mouseout", function(event) {
                // fix for safari.  mouseleave is not working in safari for this case, so using mouseout
                // and checking the parents
                // need to set a timeout because relatedTarget does not work in all browsers
                if(self.focusOutTimeout) {
                    window.clearTimeout(self.focusOutTimeout);
                    self.focusOutTimeout = null;
                }

                var checkRelated = function() {
                    var child = relatedTarget;
                    var isChild = false;
                    while (child) {
                        if (child == filterOverlay) {
                            isChild = true;
                            break;
                        }
                        child = child.parentNode;
                    }

                    if(!isChild) {
                        self.setFilterOverlayVisible(false);
                    }
                };

                var relatedTarget = event.relatedTarget;
                if(relatedTarget) {
                    checkRelated();
                }
                else {
                    self.focusOutTimeout = window.setTimeout(function(){
                        relatedTarget = document.activeElement;
                        checkRelated();
                    }, 10);
                }
            });

            commentPostParts.push(divData.container);
            self.appendMultiple(commentBoxContainer, commentPostParts);

            var displayCommentContainer = document.createElement('div');
            displayCommentContainer.className = 'commentPanel-entry-container';
            commentContainers.push(displayCommentContainer);

            // No comments message
            this.divNoComment = document.createElement('div');
            this.divNoComment.className = "no-comments-message";
            this.divNoComment.innerHTML = this.locStrings["loading_comments"];
            this.divNoComment.style.display = "none"; // start out hidden
            displayCommentContainer.appendChild(this.divNoComment);

            this.appendMultiple(this.rootContainer, commentContainers);

            // Allow external classes to hook events to our commenting text areas.
            if (this.settings && this.settings.textInputFormatFunc) {
                this.settings.textInputFormatFunc(divData.textarea);
            }

            // add event listeners
            eventManager.addEventListener(divData.postButton, "click", function(event) {
                self.onPostClick(divData.textarea, divData.postButton);
            });

            eventManager.addEventListener(divData.textarea, "keydown", function(event) {
                function checkButton() {
                    self.updatePostButtons(divData.postButton, divData.textarea);
                }
                setTimeout(checkButton,0);
            });

            // For "new comment"
            divData.container.setFocused = function(focused) {
                if(focused) {
                    commentBoxContainer.classList.add("selected");
                    divData.defaultTextarea.style.display = "none";
                }
                else {
                    if(divData.textarea.innerHTML === "") {
                        divData.defaultTextarea.style.display = "block";
                    }
                    commentBoxContainer.classList.remove("selected");
                }
            };

            eventManager.addEventListener(divData.textarea, "focus", function() {
                divData.container.setFocused(true);

                self.fireEvent({type:self.EVENT_COMMENTS2_FOCUS_CHANGE_NEW_COMMENT, data:{focused:true}});
            });
            eventManager.addEventListener(divData.textarea, "blur", function(event) {
                // Fix for IE where clicking the post reply button removes focus from
                // text area, starting the collapse animation, thus making the post
                // reply button un-clickable
                // Fix is to delay the collapse animation at least 1 frame
                self.callOnFocusOut(event, divData.postButton, [divData.bottom, commentBoxContainer, commentMarkupContainer],
                    function() {
                        divData.container.setFocused(false);
                    }
                );

                self.fireEvent({type:self.EVENT_COMMENTS2_FOCUS_CHANGE_NEW_COMMENT, data:{focused:false}});
            });

            eventManager.addEventListener(displayCommentContainer, "scroll", function(event) {
                self.fireEvent(self.EVENT_COMMENTS2_SCROLL_COMMENT_ENTRIES);
            });

            // has it if the "attachments" feature in settings is enabled
            if(divData.addAttachmentButton) {
                // move the attachment button to the back
                divData.bottom.appendChild(divData.addAttachmentButton);

                this.addTooltip(divData.addAttachmentButton, this.locStrings['attachment_tooltip'], eventManager);

                eventManager.addEventListener(divData.addAttachmentButton, "click", function(event) {
                    self.openAttachmentBrowser(divData.attachments);
                });
            }

            // has it if the "snapshot" feature in settings is enabled
            if (divData.takeSnapshotBtn) {
                this.addTooltip(divData.takeSnapshotBtn, this.locStrings['image_capture_tooltip'], eventManager);

                eventManager.addEventListener(divData.takeSnapshotBtn, "click", function(event) {
                    self.fireEvent(self.EVENT_COMMENTS2_REQUEST_SNAPSHOT);
                });
            }

            this.clearEventListeners = function() {
                eventManager.destroy();
                divData.attachments.eventManager.destroy();
            };

            self.postContainer = divData.container;
            self.postTextArea = divData.textarea;
            self.postButton = divData.postButton;
            self.cancelButton = divData.cancelButton;
            self.addCommentContainer = commentBoxContainer;
            self.commentEntryContainer = displayCommentContainer;
            self.attachmentsData = divData.attachments;
            self.snapshotButton = divData.takeSnapshotBtn;

            // sets buttons as inactive since there is no post text
            this.updatePostButtons(this.postButton, this.postTextArea);
            divData.container.setFocused(false);

            // After the panel is built, it isn't rendered in time for the height calculation when reopening a file in A360
            // Setting a timeout delays this calculation until after the HTML has been rendered
            window.setTimeout(this.updateCommentsHeight.bind(this), 0);
        };

        /**
         * Destroys the CommentPanel, cleans up any listeners attached to it and removes the ShowMarkups option from the
         * Settings panel.
         */
        this.destroy = function() {

            // remove event listeners for the top post panel
            if (this.clearEventListeners) {
                this.clearEventListeners();
                this.clearEventListeners = null;
            }
            var i,len;
            // remove event listeners for all entries
            for (i = 0, len = this.commentDataList.length; i<len; ++i) {
                var dataPanel = this.commentDataList[i];
                var entry = dataPanel['div-element'];
                if (entry) {
                    entry.removeListeners();
                }
            }

            if(this.focusOutTimeout) {
                window.clearTimeout(this.focusOutTimeout);
                this.focusOutTimeout = null;
            }

            this.commentDataList = null;
            this.tooltips = null;
            this.postTextArea = null;
            this.postContainer = null;
            this.postButton = null;
            this.addCommentContainer = null;
            this.commentEntryContainer = null;
            this.filterOverlay = null;
            this.filterButton = null;
            this.sheetFilterelements = null;
            this.attachmentsData = null;
            this.snapshotButton = null;

            self.messageOverlay.destroy();
            self.messageOverlay = null;

            this.parentContainer.removeChild(this.wrapper);
            this.rootContainer = null;
            this.wrapper = null;
            this.divNoComment = null;

            this.parentContainer = null;

            Autodesk.Comments2.remTrait_eventDispatcher(this);
        };

        /**
         * Makes sure the comments panel is visible
         */
        this.verifyPanelVisibility = function() {

            // Make sure we are not in full screen mode.
            if (this.viewer && this.viewer.setScreenMode) {
                this.viewer.setScreenMode(Autodesk.Viewing.Viewer.ScreenMode.kNormal);
            }

            // Notify app that the comment panel needs to be open.
            if (this.settings.openCommentsPanel) {
                this.settings.openCommentsPanel();
            }

            // Visibility check.
            if (!this.isVisible()) {
                this.setVisible(true);
            }
        };

        /**
         * Opens the comment panel and sets the focus to the post textfield
         */
        this.setFocusToPostComment = function() {
            this.verifyPanelVisibility();
            this.postTextArea.focus();
        };

        /**
         * Renders a comment from the existing state of the viewer and UI and then saves the comment.
         * @param {HtmlTextArea} postTextArea - TextArea that contains the text for this comment's body.
         * @private
         */
        this.onPostClick = function(postTextArea) {

            // Abort if no text.
            var textToPost = postTextArea.innerHTML;
            if (textToPost === "") {
                return;
            }

            var eventData = {
                commentBody: textToPost,
                textArea: postTextArea
            };

            this.fireEvent({ type: this.EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT, data: eventData });
        };

        /**
         * Renders a comment reply from the text inputed and UI and then saves the comment.
         * @param {Object} postReplyData - Object containing reply-widget dom references.
         * @param {Object} parentAppComment - the parent AppComment that contains this post textarea
         * @private
         */
        this.onPostReplyClick = function(postReplyData, parentAppComment) {

            // Abort if the parent comment has not been saved to the db
            if(parentAppComment['serverStatus'] !== Autodesk.Comments2.Constants.COMMENT_STATUS_SAVED_TO_DB) {
                return;
            }

            // Abort if no text.
            var postTextArea = postReplyData.textarea;
            var textToPost = postTextArea.innerHTML;
            if (textToPost === "") {
                return;
            }

            var eventData = {
                textArea: postTextArea,
                parentAppComment: parentAppComment,
                commentBody: textToPost
            };

            this.fireEvent({ type: this.EVENT_COMMENTS2_CLICK_POST_NEW_COMMENT_REPLY, data: eventData });
        };

        /**
         * Notifies the Comments Panel that a post new comment operation has began.
         * Post operation, from a user point of view, can not be cancelled at this point.
         * @param {Object} appComment
         */
        this.offlineNewCommentFlow = function(appComment) {
            this.postTextArea.innerHTML = '';
            this.resetAttachments(this.attachmentsData);
            this.setActiveFramedTool(null);
            this.postContainer.setFocused(false);
            this.postButton.disabled = true;
            this.checkNoCommentsVisible();
            this.updateStatusBar();
            this.scrollToComment(appComment);

            // animate the appComment in
            var commentEntry = this.getPanelData(appComment, "div-element");
            commentEntry.classList.add(ANIMATE_IN);
        };

        /**
         * Called by the CommentApp right after an appComment is created on the client before a server response
         * @param {Object} appComment
         * @private
         */
        this.onCreateAppComment = function(appComment) {
            var panelData = {
                'div-element': null,     // Gets populated on createCommentEntry().
                'div-data': null,        // Gets populated on createCommentEntry().
                'div-active': null,      // Gets set by setCommentActive().
                'reply-div-data': null,   // Gets populated when appending a reply container to the comment.
                'snapshot-div': null,    // Gets populated when attachments are present in refreshCommentEntry().
                'replies': []
            };
            appComment['panel-data'] = panelData;
            this.commentDataList.push(panelData);
        };

        /**
         * Removes appComment panelData from the panelData list
         * @param {Object} appComment
         * @private
         */
        this.onRemoveAppComment = function(appComment) {
            var panelData = appComment['panel-data'];
            var index = this.commentDataList.indexOf(panelData);
            if (index !== -1) {
                this.commentDataList.splice(index, 1);
            }
        };

        /**
         * Notifies the Comments Panel that a post new comment reply operation has begun.
         * Post operation, from a user point of view, can not be cancelled at this point.
         * @param {Object} appCommentReply
         */
        this.offlineNewCommentReplyFlow = function(appCommentReply) {
            var containerDomElem = this.getPanelData(appCommentReply.parent, 'reply-div-data');
            containerDomElem.postData.textarea.innerHTML = '';
            containerDomElem.postData.container.setFocused(false);
            containerDomElem.postData.postButton.disabled = true;
            containerDomElem.setExpanded(false);

            var domElem = this.getPanelData(appCommentReply, 'div-data');
            domElem.container.classList.add(ANIMATE_IN);
        };

        /**
         * Called by the CommentApp right after an appCommentReply is created on the client before a server response
         * @param {Object} appComment
         * @private
         */
        this.onCreateAppCommentReply = function(appCommentReply) {
            var panelData = {
                'div-data': null      // Gets populated on createCommentReplyEntry()
            };
            appCommentReply['panel-data'] = panelData;
            appCommentReply.parent['panel-data']['replies'].push(panelData);
        };

        /**
         * Removes appCommentReply data from appComment PanelData
         * @param {Object} appCommentReply
         * @private
         */
        this.onRemoveAppCommentReply = function(appCommentReply) {
            var parentPanelData = appCommentReply.parent['panel-data'];
            var panelData = appCommentReply['panel-data'];

            var replies = this.getPanelData(appCommentReply.parent, 'replies');
            var index = replies.indexOf(parentPanelData);
            if (index !== -1) {
                replies.splice(index, 1);
            }
        };

        /**
         * Sets the panelData on an appComment.  UI data associated with appComments gets stored here
         * @param {Object} appComment
         * @param {String} attr
         * @param {*} value
         * @private
         */
        this.setPanelData = function(appComment, attr, value) {
            appComment["panel-data"][attr] = value;
        };

        /**
         * Gets panelData on an appComment
         * @param {Object} appComment
         * @param {String} attr - the key of the data to retrieve
         * @private
         */
        this.getPanelData = function(appComment, attr) {
            return appComment["panel-data"][attr];
        };

        /**
         * Renders a comment from an appComment data.
         * @param {Object} appComment - Comment data.
         * @param {Boolean} canHaveReplies - whether or not the comment can contain replies
         * @private
         */
        this.createCommentEntry = function( appComment, canHaveReplies ) {

            var divData;
            var eventManager = new Autodesk.Comment.EventManager();

            // Comment entry.
            divData = this.createCommentDivData();
            divData.eventManager = eventManager;

            this.setPanelData(appComment, 'div-element', divData.container);
            this.setPanelData(appComment, 'div-data', divData);

            this.commentEntryContainer.appendChild(divData.container);

            eventManager.addEventListener(divData.container, 'click', function(){
                this.onCommentContentClick(appComment);
            }.bind(this), false);


            // if the "replies" feature is enabled, add a div for posting new ones
            var replies;
            if(canHaveReplies) {
                replies = [];
                var replyContainerData = this.appendReplyContainerDivData(appComment);
                this.setPanelData(appComment, 'reply-div-data', replyContainerData);
            }

            // Used to remove all event listeners associated with this comment.
            divData.container.removeListeners = function() {
                // remove snapshot tooltip if present
                var snapshot = self.getPanelData(appComment, 'snapshot-div');
                if(snapshot) {
                    self.removeTooltip(snapshot);
                }

                eventManager.destroy();

                if(Array.isArray(replies)) {
                    for(var i = 0, len = replies.length; i < len; ++i) {
                        replies[i].container.removeListeners();
                    }
                }
            };
        };

        /**
         * Renders a comment reply from an appCommentReply data.
         * @param {Object} appComment - Comment data.
         * @private
         */
        this.createCommentReplyEntry = function( appCommentReply ) {

            var divData;
            var eventManager = new Autodesk.Comment.EventManager();

            // Comment entry.
            divData = this.createCommentReplyDivData();
            divData.eventManager = eventManager;

            this.setPanelData(appCommentReply, 'div-data', divData);

            var replyContainerData = this.getPanelData(appCommentReply.parent, 'reply-div-data');
            replyContainerData.container.appendChild(divData.container);

            // Used to remove all event listeners associated with this comment reply.
            divData.container.removeListeners = function() {
                eventManager.destroy();
            };
        };

        /**
         * Refreshes a comment entry's UI based on the current state of the appComment provided
         * @param {Object} appComment
         * @param {Boolean} [allowDelete] - if the appComment can be deleted
         * @private
         */
        this.refreshCommentEntry = function(appComment, allowDelete) {
            this.refreshEntry(appComment);
            this.setCommentEntryListeners(appComment, allowDelete);
        };

        /**
         * Refreshes a commentReply entry's UI based on the current state of the appCommentReply provided
         * @param {Object} appCommentReply
         * @param {Boolean} allowDelete - if the appComment can be deleted
         * @private
         */
        this.refreshCommentReplyEntry = function(appCommentReply, allowDelete) {
            this.refreshEntry(appCommentReply);
            this.setCommentEntryReplyListeners(appCommentReply, allowDelete);
        };

        /**
         * Changes in appComment, appCommentReply (and dbComment) are reflected back into the dom.
         * @param {Object} appComment
         * @private
         */
        this.refreshEntry = function(appComment) {
            var domElem = this.getPanelData(appComment, 'div-data');

            domElem.text.innerHTML = appComment.content;
            domElem.name.innerHTML = (function(){
                var authorName = 'Pending...'; // TODO: Revisit
                if ('actor' in appComment.dbComment && 'name' in appComment.dbComment.actor) {
                    authorName = appComment.dbComment.actor.name;
                } else if (settings.displayName) {
                    authorName = settings.displayName;
                }
                return authorName;
            })();

            // Sheet name (Facet name as Fusion calls it)
            if(domElem.sheetName) {
                var onCurrentSheet = appComment['onCurrentSheet'];
                if (!onCurrentSheet) {
                    var sheetLabel = this.locStrings.unknown_sheet;
                    if (this.sheetGuidLabelMap && (appComment.dbComment.layoutName in this.sheetGuidLabelMap)) {
                        sheetLabel = this.sheetGuidLabelMap[appComment.dbComment.layoutName];
                    }
                    // When the sheet name is not found, it may because the comment belongs
                    // to different (older, newer) version of the document.  Thus, we can
                    // gracefully degrade into a more 'precise' message.
                    else if (!appComment['thisVersion']) {
                        sheetLabel = this.locStrings.different_version_sheet;
                    }
                    domElem.sheetName.innerHTML = sheetLabel;
                }
                var sheetSpanDisplay = onCurrentSheet ? "none" : "block";
                domElem.sheetIcon.style.display = sheetSpanDisplay;
                domElem.sheetName.style.display = sheetSpanDisplay;
            }

            // Timestamp
            if (appComment['serverStatus'] === Autodesk.Comments2.Constants.COMMENT_STATUS_SAVED_TO_DB) {
                domElem.date.innerHTML = this.formatTimestamp(appComment['lastPost']);
            } else if (appComment['serverStatus'] === Autodesk.Comments2.Constants.COMMENT_STATUS_FAILED_TO_POST) {
                domElem.date.innerHTML = this.locStrings.postComment_failure;
            } else {
                domElem.date.innerHTML = this.locStrings.postComment_posting;
            }

            // Version
            if (domElem.version) {
                domElem.version.style.display = "block";
                domElem.version.innerHTML = this.locStrings["version_symbol"] + " " + appComment['version'];
            }

            // Profile Image
            var imageNotFound = function() {
                domElem.image.src = self.DEFAULT_USER_IMAGE;
            };

            // Load the image for the user if provided.
            if (settings.avatarUrl && settings.oxygenId && appComment.dbComment && appComment.dbComment.actor &&
                (settings.oxygenId === appComment.dbComment.actor.id)) {
                // Special case for when we are posting a comment and waiting for server response
                domElem.image.onerror = imageNotFound;
                domElem.image.src = settings.avatarUrl;
            } else if ('actor' in appComment.dbComment && "image" in appComment.dbComment.actor) {
                domElem.image.onerror = imageNotFound;
                domElem.image.src = appComment.dbComment.actor.image;
            }  else {
                imageNotFound();
            }

            // Attachments
            //  First remove them all, then add them all again.
            if(domElem.attachments) {
                this.removeAllAttachments(appComment);
                var appAttachmentList = appComment['attachments'];
                appAttachmentList.forEach(function(appAttachment) {
                    if (appAttachment.type === Autodesk.Comments2.Constants.ATTACHMENT_TYPE_SNAPSHOT) {
                        var attachmentData = this.addAttachment(appComment, appAttachment);

                        // add tooltip to snapshot
                        var snapshot = attachmentData.imageHolder;
                        this.setPanelData(appComment, 'snapshot-div', snapshot);
                        this.addTooltip(snapshot, this.locStrings["download_tooltip"], domElem.eventManager, "right");
                    }
                }.bind(this));
            }

            // Set the correct textarea id for the post section
            var replyDivData = this.getPanelData(appComment, 'reply-div-data');
            if (replyDivData) {
                replyDivData.postData.textarea.id = this.getNewReplyTextAreaId(appComment);
            }

            if (this.settings.customFormatCommentEntry) {
                this.settings.customFormatCommentEntry(domElem, appComment);
            }
        };

        /**
         * Sets the event listeners for a commentEntry
         * @param {Object} appComment
         * @param {Boolean} allowDelete - if the entry can be deleted, otherwise a check is done to see who the owner is
         * @private
         */
        this.setCommentEntryListeners = function(appComment, allowDelete) {
            var domElem = this.getPanelData(appComment, 'div-data');

            // check to see if the comment is allowed to be deleted, otherwise do the normal canDelete check
            // the CommentApp allows the comment to be deleted when first posted since the poster can always delete it
            var canDelete = allowDelete || this.canDeleteCommentEntry(appComment);

            // set event listeners
            var eventManager = domElem.eventManager;
            if (canDelete) {
                domElem.deleteButton.style.display = "block";
                if(!eventManager.hasEventListener(domElem.deleteButton, "click")) {
                    eventManager.addEventListener(domElem.deleteButton, "click", function(event) {
                        event.stopPropagation();
                        function onConfirmDelete() {
                            self.fireEvent({ type: self.EVENT_COMMENTS2_REQUEST_DELETE_COMMENT, data: appComment });
                        }
                        self.messageOverlay.open(self.messageOverlay.CONFIRM,
                            self.locStrings["confirm_title"],
                            self.locStrings["delete_comment"],
                            onConfirmDelete);
                    });
                }

                if(!eventManager.hasEventListener(domElem.container, "mouseenter")) {
                    eventManager.addEventListener(domElem.container, "mouseenter", function(event) {
                        domElem.deleteButton.classList.add("hovered");
                    }, false);
                }
                if(!eventManager.hasEventListener(domElem.container, "mouseleave")) {
                    eventManager.addEventListener(domElem.container, "mouseleave", function(event) {
                        domElem.deleteButton.classList.remove("hovered");
                    }, false);
                }
            }
            else {
                domElem.eventManager.removeTargetsListeners(domElem.deleteButton);
                domElem.eventManager.removeEventListener(domElem.container, "mouseenter");
                domElem.eventManager.removeEventListener(domElem.container, "mouseleave");
                domElem.deleteButton.style.display = "none";
            }

            var onCurrentSheet = appComment['onCurrentSheet'];
            if(onCurrentSheet) {
                domElem.eventManager.removeTargetsListeners(domElem.sheetName);
            }
            else {
                if(!eventManager.hasEventListener(domElem.sheetName, "click")) {
                    eventManager.addEventListener(domElem.sheetName, "click", function(event) {
                        self.fireEvent({type: self.EVENT_COMMENTS2_REQUEST_CHANGE_SHEET, data:appComment});
                    }, false);
                }
            }
        };

        /**
         * Sets the event listeners for a commentEntryReply
         * @param {Object} appCommentReply
         * @param {Boolean} allowDelete - if the entry can be deleted, otherwise a check is done to see who the owner is
         * @private
         */
        this.setCommentEntryReplyListeners = function(appCommentReply, allowDelete) {
            var domElem = this.getPanelData(appCommentReply, 'div-data');

            // check to see if the comment is allowed to be deleted, otherwise do the normal canDelete check
            // the CommentApp allows the comment to be deleted when first posted since the poster can always delete it
            var canDelete = allowDelete || this.canDeleteCommentReplyEntry(appCommentReply);

            // set event listeners
            var eventManager = domElem.eventManager;
            if (canDelete) {
                domElem.deleteButton.style.display = "block";
                if(!eventManager.hasEventListener(domElem.deleteButton, "click")) {
                    eventManager.addEventListener(domElem.deleteButton, "click", function(event) {
                        // TODO: add delete functionality
                        event.stopPropagation();
                        function onConfirmDelete() {
                            self.fireEvent({ type: self.EVENT_COMMENTS2_REQUEST_DELETE_COMMENT_REPLY, data: appCommentReply });
                        }
                        self.messageOverlay.open(self.messageOverlay.CONFIRM,
                            self.locStrings["confirm_title"],
                            self.locStrings["delete_comment_reply"],
                            onConfirmDelete);
                    });
                }
                if(!eventManager.hasEventListener(domElem.container, "mouseenter")) {
                    eventManager.addEventListener(domElem.container, "mouseenter", function(event) {
                        domElem.deleteButton.classList.add("hovered");
                    }, false);
                }
                if(!eventManager.hasEventListener(domElem.container, "mouseleave")) {
                    eventManager.addEventListener(domElem.container, "mouseleave", function(event) {
                        domElem.deleteButton.classList.remove("hovered");
                    }, false);
                }
            }
            else {
                domElem.eventManager.removeTargetsListeners(domElem.deleteButton);
                domElem.eventManager.removeEventListener(domElem.container, "mouseenter");
                domElem.eventManager.removeEventListener(domElem.container, "mouseleave");
                domElem.deleteButton.style.display = "none";
            }
        };

        /**
         * Sets the visibility of a comment
         * @param {Object} appComment
         * @param {Boolean} bVisible
         * @private
         */
        this.setCommentVisibility = function(appComment, bVisible) {
            var entry = this.getPanelData(appComment, 'div-element');
            entry.style.display = bVisible ? "block" : "none";
        };

        /**
         * Checks if the comment's dom element is being displayed or not
         *
         * @param {Object} commentPanelData
         * @returns {boolean}
         * @private
         */
        this.isCommentDivVisible = function(commentPanelData) {
            var entry = commentPanelData['div-element'];
            return (entry.style.display === "block") || (entry.style.display === "");
        };

        /**
         * Creates and returns data associated with a comment entry's ui
         * @returns {Object|*}
         * @private
         */
        this.createCommentDivData = function() {
            return this.createEntryDivData(null, true);
        };

        /**
         * Creates and returns data associated with a comment entry reply's ui
         * @returns {Object|*}
         * @private
         */
        this.createCommentReplyDivData = function() {
            return this.createEntryDivData(["version", "sheetName"], false);
        };

        /**
         * Creates a comment div that's included in both the comment and reply's bodies.
         * @returns {Object} Data containing references to all the divs created.
         * @private
         */
        this.createEntryDivData = function(skipSpans, includeAttachments) {

            skipSpans = skipSpans || [];
            var ret = {};

            var commentContainer = ret.container = document.createElement("div");
            commentContainer.className = "commentPanel-entry";

            // Left section.
            var commentLeftDiv = ret.left = document.createElement("div");
            commentLeftDiv.className = "commentPanel-entry-left";

            // Profile Image
            var commentorImage = ret.image = new Image();
            commentorImage.className = "commentPanel-entry-image";

            commentLeftDiv.appendChild(commentorImage);

            // Middle section.
            var commentContentDiv = ret.content =  document.createElement("div");
            commentContentDiv.className = "commentPanel-entry-content";

            var spans = ["name", "date", "version", "sheetName", "text"];
            var commentElements = [];
            for(var i = 0, len = spans.length; i < len; ++i) {
                var spanName = spans[i];
                if(skipSpans.indexOf(spanName) > -1) {
                    continue;
                }

                var span = ret[spanName] = document.createElement('span');
                span.className = "commentPanel-entry-span " + "commentPanel-entry-" + spanName;
                commentElements.push(span);
            }

            if(ret["version"]) {
                ret["version"].style.display = "none";
            }

            if(ret["sheetName"]) {
				var nameIndex = commentElements.indexOf(ret["sheetName"]);

   				var sheetIcon = ret.sheetIcon = document.createElement('span');
            	sheetIcon.className = "commentPanel-entry-span commentPanel-entry-sheetIcon";
				commentElements.splice(nameIndex, 0, sheetIcon);
            }
            
            if(includeAttachments) {
                var attachments = ret.attachments = this.createAttachmentsDiv(false); // cannot delete attachments
                commentElements.push(attachments.container);
            }

            this.appendMultiple(commentContentDiv, commentElements);

            // right section
            var commentRightDiv = ret.right = document.createElement("div");
            commentRightDiv.className = "commentPanel-entry-right";

            // add delete link
            var button = ret.deleteButton = self.createElement("input", "submit",
                "commentPanel-imageButton commentPanel-imageButton-delete commentPanel-delete-entry disabled");
            button.style.display = "none";
            commentRightDiv.appendChild(button);

            this.appendMultiple(commentContainer, [commentLeftDiv, commentRightDiv, commentContentDiv]);
            return ret;
        };

        /**
         * Appends a reply container to an appComment's container and add's the event listeners for posting
         * @param {Object} appComment
         */
        this.appendReplyContainerDivData = function(appComment) {
            var ret = {};

            var parentData = this.getPanelData(appComment, 'div-data');
            var eventManager = parentData.eventManager;

            // add the replies wrapper and posting textfield
            var repliesWrapper = ret.wrapper = document.createElement("div");
            repliesWrapper.className = "commentPanel-replies-wrapper";

            var stringData = {
                buttonPost: this.locStrings["post_new_reply"],
                buttonCancel: this.locStrings["button_cancel"],
                defaultText: this.locStrings["default_textarea_reply_message"]
            };
            var canAddAttachments = false; // Attachments cannot be added to replies right now
            var canTakeSnapshot = false;
            var hasCancelButton = true;
            var postDivOptions = {
                isReply: true,
                canAddAttachments: canAddAttachments,
                canTakeSnapshot: canTakeSnapshot,
                hasCancelButton: hasCancelButton
            };
            var newReplyTextAreaDivId = null; // set the id after posting the comment because we need the comment index
            var postData = ret.postData = this.createPostDiv(newReplyTextAreaDivId, stringData, postDivOptions);

            // Since IE-10 does not support pointer-event none, we thus propagate the focus event from
            // the "placeholder text" onto the text area beneath.
            eventManager.addEventListener(postData.defaultTextarea, 'click', function(){
                postData.textarea.focus();
            });

            var expandPostSpan = ret.expand = document.createElement("span");
            expandPostSpan.className = "commentPanel-replies-expandSpan";
            expandPostSpan.innerHTML = this.locStrings["enter_reply_message"];

            var repliesContainer = ret.container = document.createElement("div");
            repliesContainer.className = "commentPanel-replies-container";

            this.appendMultiple(repliesWrapper, [repliesContainer, expandPostSpan, postData.container]);
            parentData.container.appendChild(repliesWrapper);

            // Allow external classes to hook events to our commenting text areas.
            if (this.settings && this.settings.textInputFormatFunc) {
                this.settings.textInputFormatFunc(postData.textarea);
            }

            if (this.settings && this.settings.customFormatPostCommentSection) {
                this.settings.customFormatPostCommentSection(postData, true);
            }
            eventManager.addEventListener(repliesWrapper, 'click', function(event) {
                // avoid propagating click to container comment since we
                // don't want to select the comment
                event.stopPropagation();
            }.bind(this), false);

            eventManager.addEventListener(postData.textarea, "focus", function() {
                postData.container.setFocused(true);
            });
            eventManager.addEventListener(postData.textarea, "blur", function() {
                postData.container.setFocused(false);
            });
            eventManager.addEventListener(postData.textarea, "keydown", function(event) {
                function checkButton() {
                    self.updatePostButtons(postData.postButton, postData.textarea);
                }
                setTimeout(checkButton,0);
            });

            // add event listeners
            eventManager.addEventListener(postData.postButton, "click", function(event) {
                self.onPostReplyClick(postData, appComment);
            });

            eventManager.addEventListener(postData.cancelButton, "click", function(event) {
                postData.textarea.innerHTML = "";
                postData.container.setFocused(false);
                postData.textarea.blur();
                ret.setExpanded(false);
                self.updatePostButtons(postData.postButton, postData.textarea);
            });

            // For replies
            postData.container.setFocused = function(focused) {
                if(focused) {
                    postData.defaultTextarea.style.display = "none";
                }
                else {
                    if(postData.textarea.innerHTML === "") {
                        postData.defaultTextarea.style.display = "block";
                    }
                }
            };

            eventManager.addEventListener(expandPostSpan, "click", function(event) {
                event.stopPropagation();
                ret.setExpanded(true);
                requestAnimationFrame(function(){
                    postData.textarea.focus();
                });
            });

            ret.setExpanded = function(expanded) {
                if(expanded) {
                    postData.container.style.display = "block";
                    expandPostSpan.style.display = "none";
                }
                else {
                    postData.container.style.display = "none";
                    expandPostSpan.style.display = "block";
                }
            };
            this.updatePostButtons(postData.postButton, postData.textarea);
            postData.container.setFocused(false);

            return ret;
        };

        this.appendCommentMarker = function(appComment) {
            var domElem = this.getPanelData(appComment, 'div-data');
            if(domElem.commentMarker) {
                return domElem.commentMarker;
            }

            var commentMarker = domElem.commentMarker = document.createElement('div');
            commentMarker.className = "commentPanel-marker";
            domElem.right.appendChild(commentMarker);

            var eventManager = domElem.eventManager;
            eventManager.addEventListener(commentMarker, "mouseenter", function(event) {
                self.onCommentMarkerEnter(appComment);
                event.stopPropagation();
                event.preventDefault();
            }, false);

            eventManager.addEventListener(commentMarker, "mouseleave", function(event) {
                self.onCommentMarkerLeave(appComment);
                event.stopPropagation();
                event.preventDefault();
            }, false);

            return commentMarker;
        };

        /**
         * Creates a post div that's used for both posting comments or replies.
         * @param {String} textareaId - the id given to the post textarea
         * @param {Object} strings - an object containing the strings to use for the post div
         * @param {Object} options - Additional options indication what sub elements to display.
         * @param {Boolean} options.isReply - whether or not the post is actually a reply to another comment
         * @param {Boolean} options.hasCancelButton - whether or not the post has a cancel button
         * @param {Boolean} options.canAddAttachments - whether or not attachments can be added to the post
         * @param {Boolean} options.canTakeSnapshot - whether or not the take snapshot can be added to the post
         *
         * @returns {Object} Data containing references to all the divs created.
         * @private
         */
        this.createPostDiv = function(textareaId, strings, options) {
            var ret = {};

            var isReply = options.isReply || false;
            var hasCancelButton = options.hasCancelButton || false;
            var canAddAttachments = options.canAddAttachments || false;
            var canTakeSnapshot = options.canTakeSnapshot || false;

            var postContainer = ret.container = document.createElement("div");
            postContainer.className = "commentPanel-post";

            // Top section.
            var postTopDiv = ret.top = document.createElement("div");
            postTopDiv.className = "commentPanel-post-top";

            var commentorImage = ret.image = new Image();
            commentorImage.className = "commentPanel-post-image";
            commentorImage.onerror = function() { commentorImage.src = this.DEFAULT_USER_IMAGE; }.bind(this);
            commentorImage.src = this.settings && this.settings.avatarUrl ? this.settings.avatarUrl
                : this.DEFAULT_USER_IMAGE;

            var commentTextareaContainer = ret.textareaContainer = document.createElement('div');
            commentTextareaContainer.className = "commentPanel-textarea-container";

            var commentTextarea = ret.textarea = document.createElement('div');
            commentTextarea.className = "commentPanel-textarea-post";
            commentTextarea.setAttribute("contenteditable", "true");
            if(textareaId) {
                commentTextarea.id = textareaId;
            }

            var commentDefaultTextarea = ret.defaultTextarea = document.createElement('div');
            commentDefaultTextarea.className = "commentPanel-textarea-post-default";
            commentDefaultTextarea.innerHTML = strings["defaultText"];

            this.appendMultiple(commentTextareaContainer, [commentTextarea]);
            this.appendMultiple(postTopDiv, [commentorImage, commentTextareaContainer, commentDefaultTextarea]);

            // Bottom section.
            var postBottomDiv = ret.bottom = document.createElement("div");
            postBottomDiv.className = "commentPanel-post-bottom";

            var postButton = ret.postButton = this.createButton('commentPanel-post-button', strings['buttonPost']);
            var bottomElements = [postButton];

            if(hasCancelButton) {
                var cancelButton = ret.cancelButton = this.createButton('commentPanel-cancelPost-button', strings['buttonCancel']);
                bottomElements.push(cancelButton);
            }

            // create an editable attachments section
            var attachments = ret.attachments = this.createAttachmentsDiv(true); // pass true to enable deleting attachments
            attachments.container.className = "commentPanel-post-attachments-container";
            var attachmentsDiv = attachments.container;

            // if the "attachments" feature is enabled, add a button for adding new ones
            if(canAddAttachments) {
                var addAttachmentButton = ret.addAttachmentButton = this.createElement("input", "submit", "commentPanel-toolButton commentPanel-toolButton-attachment");
                bottomElements.unshift(addAttachmentButton);
            }

            // 'Snapshot' magic
            if (canTakeSnapshot) {
                var takeSnapshotBtn = ret.takeSnapshotBtn = this.createElement("input", "submit", 'commentPanel-toolButton commentPanel__takeSnapshot');
                bottomElements.unshift(takeSnapshotBtn);
            }

            this.appendMultiple(postBottomDiv, bottomElements);
            this.appendMultiple(postContainer, [postTopDiv, postBottomDiv, attachmentsDiv]);

            return ret;
        };

        /**
         * Creates an attachments div to contain screenshots and other attachments
         * It has its own event manager since it will be cleared after each postW
         * @param {Boolean} canDelete - if the attachments can be deleted or not
         * @returns {}
         * @private
         */
        this.createAttachmentsDiv = function(canDelete) {
            var ret = {
                canDelete: canDelete
            };
            // store data related to attachments uploaded
            ret.list = [];
            ret.eventManager = new Autodesk.Comment.EventManager();

            var attachmentsContainer = document.createElement("div");
            attachmentsContainer.className = "commentPanel-attachments-container";
            ret.container = attachmentsContainer;

            this.resetAttachments(ret);

            return ret;
        };

        /**
         * Resets attachments
         * @param {Object} attachmentsData - contains the html and attachments data for a post
         * @private
         */
        this.resetAttachments = function(attachmentsData) {
            var container = attachmentsData.container;
            var eventManager = attachmentsData.eventManager;

            container.innerHTML = "";

            // hide the container until there are attachments
            container.style.display = "none";

            attachmentsData.eventManager.removeAllListeners();
            var previousAttachments = attachmentsData.list.length;
            attachmentsData.list = [];

            // update the height of the comment entry container
            if (previousAttachments > 0) {
                this.updateCommentsHeight();
            }
        };

        /**
         * Creates an attachment element for an item that is not yet associated to a comment.
         * @param {Object} appAttachment
         * @returns {Object}
         */
        this.createNewAttachment = function(appAttachment) {
            var attachmentItem = this.createAttachmentItem(this.attachmentsData, appAttachment, null);
            attachmentItem.dataSource = appAttachment;
            return attachmentItem;
        };

        /**
         * Creates a div containing an attachment item and adds it to the supplied attachments container
         * Adds event listeners needed for filling and deleting attachments
         * @param {Object} attachmentsData
         * @param {Object} appAttachment
         * @param {Object} [appComment] comment associated with attachment. Can be null when the attachment
         *                              has not been posted yet.
         * @returns {Object}
         */
        this.createAttachmentItem = function(attachmentsData, appAttachment, appComment) {

            var attachmentId = appAttachment.type;

            var ret = {
                id: attachmentId,
                data: {}
            };

            var attachmentItem = ret.container = document.createElement("div");
            attachmentItem.className = "commentPanel-attachmentItem";

            var imageHolder = ret.imageHolder = document.createElement("div");
            imageHolder.className = "commentPanel-attachmentItem-imageHolder";

            var imageNameSpan = ret.imageName = document.createElement("span");
            imageNameSpan.className = "commentPanel-entry-span commentPanel-attachmentItem-imageName";

            var itemElements = [imageHolder, imageNameSpan];
            var deleteButton;
            if(attachmentsData["canDelete"]) {
                deleteButton = ret.deleteButton = self.createElement("input", "submit",
                    "commentPanel-imageButton commentPanel-imageButton-delete commentPanel-delete-attachment");
                itemElements.push(deleteButton);
            }

            this.appendMultiple(attachmentItem, itemElements);

            attachmentsData.container.appendChild(attachmentItem);
            attachmentsData.container.style.display = "block"; // make sure the container is visible
            attachmentsData.list.push(ret);

            var eventManager = attachmentsData.eventManager;

            if(deleteButton) {
                eventManager.addEventListener(deleteButton, "click", function(){
                    self.deleteAttachmentItem(attachmentsData, ret);
                });
            }

            ret.setFilled = function(filled) {
                if(filled) {
                    if(deleteButton) {
                        deleteButton.style.display = "block";
                    }
                    imageHolder.classList.remove("empty");
                    eventManager.removeTargetsListeners(attachmentItem);
                    eventManager.addEventListener(imageHolder, "click", function(event) {
                        // avoid propagating click to container comment since we
                        // don't want to select the comment
                        event.stopPropagation();
                        // Handle attachment
                        self.loadAttachmentItem(appAttachment);
                    }, false);
                }
                else {
                    if(deleteButton) {
                        deleteButton.style.display = "none";
                    }
                    imageHolder.innerHTML = "";
                    imageHolder.classList.add("empty");

                    // remove the image listener
                    eventManager.removeTargetsListeners(attachmentItem);
                }
                ret.filled = filled;
            };

            // called when the holder is filled with an image
            imageHolder.setFilled = function() {
                ret.setFilled(true);
            };

            // set the initial values
            this.updateAttachmentItem(ret, appAttachment);

            // update the height of the comment entry container
            this.updateCommentsHeight();

            return ret;
        };

        /**
         * Updates an attachment item's ui based on the appAttachment data provided
         * @param {Object} attachmentItem
         * @param {Object} appAttachment
         * @private
         */
        this.updateAttachmentItem = function(attachmentItem, appAttachment) {

            var imageSource = appAttachment.data;
            var imageName = appAttachment.label;

            var imageOssPath = appAttachment.ossPath;
            var imageOssDataType = Autodesk.Comments2.Constants.ATTACHMENT_DATA_TYPE_TEXT;

            // Always try to get the small generated thumbnail (74x74px) if one is available
            // Notice that this call may fail if ACM policies have not been applied properly.
            if (appAttachment.dbAttachment && appAttachment.dbAttachment.image) {
                imageOssPath = appAttachment.dbAttachment.image;
                imageOssDataType = Autodesk.Comments2.Constants.ATTACHMENT_DATA_TYPE_BINARY;
            }

            function createImageFrom(dataSource) {
                attachmentItem.data.src = dataSource;
                var image = new Image();
                image.className = "commentPanel-entry-attachmentImg";
                image.onload = function() {
                    attachmentItem.setFilled(true);
                };
                image.src = dataSource;
                attachmentItem.imageHolder.appendChild(image);
            }

            if (imageSource) {
                createImageFrom(imageSource);
            } else if (imageOssPath) {
                attachmentItem.data.src = null;
                attachmentItem.setFilled(false);
                var onOssImageReceived = function(imageData) {
                    imageData = Autodesk.Comments2.ossAttachmentToImageDataString(imageData);
                    appAttachment.data = imageData;
                    createImageFrom(imageData);
                };
                var data = {
                    dataType: imageOssDataType,
                    callback: onOssImageReceived,
                    ossPath: imageOssPath,
                    appAttachment: appAttachment
                };
                this.fireEvent({ type:this.EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT, data: data });
            } else {
                attachmentItem.data.src = null;
                attachmentItem.setFilled(false);
            }

            if(imageName) {
                attachmentItem.data.name = imageName;
                attachmentItem.imageName.innerHTML = imageName;
                attachmentItem.imageName.style.display = 'none'; // TODO: Revisit attachment name usage - COO-27
            }
            else {
                attachmentItem.imageName.innerHTML = "";
                attachmentItem.imageName.style.display = 'none'; // TODO: Revisit attachment name usage - COO-27
            }
        };

        /**
         * Deletes an attachment item from the DOM and removes it from the list of attachments in attachmentData
         * @param {Object} attachmentsData
         * @param {Object} attachmentItem
         * @private
         */
        this.deleteAttachmentItem = function(attachmentsData, attachmentItem) {

            // remove events
            var eventManager = attachmentsData.eventManager;
            eventManager.removeTargetsListeners(attachmentItem.container);

            if(attachmentItem.deleteButton) {
                eventManager.removeTargetsListeners(attachmentItem.deleteButton);
            }

            // remove the attachment from the display
            attachmentsData.container.removeChild(attachmentItem.container);

            // remove the attachment from the list
            var list = attachmentsData.list;
            for(var i = list.length-1; i >= 0; --i) {
                var item = list[i];
                if(item === attachmentItem) {
                    list.splice(i, 1);
                    break;
                }
            }

            // hide the container if there are no attachments
            if(list.length === 0) {
                attachmentsData.container.style.display = "none";
            }

            // notify the app that an attachment has been deleted
            this.fireEvent({type: this.EVENT_COMMENTS2_REMOVE_ATTACHMENT, data:attachmentItem.dataSource});

            // update the height of the comment entry container
            this.updateCommentsHeight();
        };

        /**
         * Takes action on an attachment item
         * @param {Object} appAttachment - comment associated to the attachment, null otherwise.
         * @private
         */
        this.loadAttachmentItem = function(appAttachment) {
            if (!appAttachment) {
                return;
            }

            if (appAttachment.type === Autodesk.Comments2.Constants.ATTACHMENT_TYPE_SNAPSHOT) {
                this.getAttachmentFileDownloadData(appAttachment, function(downloadData) {
                    if (downloadData) {
                        // Open attachment in a new tab
                        window.open(downloadData);
                    }
                });
            }
            // NOTE: We should not do any treatment of type ATTACHMENT_TYPE_MARKUP.
            // TODO: Do something with ATTACHMENT_TYPE_DOCUMENT //
        };

        /**
         *
         * @param {Object} appAttachment
         * @param {Function} onDataReadyCallback
         */
        this.getAttachmentFileDownloadData = function(appAttachment, onDataReadyCallback) {

            var downloadData = appAttachment.data;
            if (settings.customGetAttachmentFileDownloadData) {
                var res = settings.customGetAttachmentFileDownloadData(appAttachment);
                if (res) {
                    downloadData = res;
                }
            }
            onDataReadyCallback(downloadData);
        };

        /**
         * Opens the attachments browser specified in settings
         * @param {Object} attachmentsData
         * @private
         */
        this.openAttachmentBrowser = function(attachmentData) {
            // TODO: Hook up a360 filebrowser in settings
        };

        /**
         * Whether the current user is the owner of the content we are commenting on.
         * @returns {Boolean}
         * @private
         */
        this.isContentOwner = function() {
            return this.settings ? this.settings.isOwner : false;
        };

        /**
         * Checks if the current user is the author of the comment.
         * @param {Object} comment An appComment or appResponse
         * @returns {Boolean}
         * @private
         */
        this.isCommentAuthor = function(comment) {

            if (!comment.dbComment.actor || !comment.dbComment.actor.id) {
                // comment has no owner, thus anyone should be able to delete it --legacy support--
                return true;
            }

            if (!this.settings) {
                // Attempting to delete owned comment without credentials.
                return false;
            }

            var authorComment = false;
            var commentOwnerId = comment.dbComment.actor.id;
            if (this.settings.oxygenId) {
                authorComment = authorComment || (this.settings.oxygenId == commentOwnerId);
            }
            return authorComment;
        };

        /**
         * The comment entry can only be deleted by the content owner or comment author
         * @param {Boolean} appComment
         * @returns {Boolean}
         * @private
         */
        this.canDeleteCommentEntry = function(appComment) {
            return this.isContentOwner() || this.isCommentAuthor(appComment);
        };

        /**
         * The comment reply entry can only be deleted by the content owner, comment author, or reply author
         * @param {Boolean} appComment
         * @returns {Boolean}
         * @private
         */
        this.canDeleteCommentReplyEntry = function(appCommentReply) {
            return this.isContentOwner() || this.isCommentAuthor(appCommentReply.parent) || this.isCommentAuthor(appCommentReply);
        };


        /**
         * Removes a comment from the dom.
         * @param {string} appComment - comment to remove
         * @private
         */
        this.removeComment = function(appComment) {

            // Delete DOM element.
            var divElem = this.getPanelData(appComment, 'div-element');
            if (divElem) {
                divElem.removeListeners();
                this.commentEntryContainer.removeChild(divElem);
            }

            this.onRemoveAppComment(appComment);
        };

        /**
         * Removes a comment reply from the dom.
         * @param {string} appCommentReply - comment to remove
         * @private
         */
        this.removeCommentReply = function(appCommentReply) {

            // Delete DOM element.
            var domElem = this.getPanelData(appCommentReply, 'div-data');
            if (domElem) {
                domElem.container.removeListeners();

                var parentReplyData = this.getPanelData(appCommentReply.parent, 'reply-div-data');
                parentReplyData.container.removeChild(domElem.container);
            }

            this.onRemoveAppCommentReply(appCommentReply);
        };

        /**
         * Updates the height of the comment's container based on the current height of the post comment section
         * @private
         */
        this.updateCommentsHeight = function() {
            var totalHeight = this.wrapper.clientHeight;
            this.commentEntryContainer.style.height = totalHeight - this.commentEntryContainer.offsetTop + 'px';
        };

        /**
         * Called by CommentApp after all appComments have been created after retrieving the comment data from the DB
         * @private
         */
        this.onRequestComments = function() {
            this.updateStatusBar();
            this.checkNoCommentsVisible();
            this.updateCommentsHeight();
        };

        /**
         * Called by CommentApp after a comment has been successfully posted to the server and the appComment has
         * been updated with the response
         * @param {Object} appComment
         * @private
         */
        this.onPostComment = function(appComment) {
            this.refreshCommentEntry(appComment);
        };

        this.onPostCommentFailure = function(appComment) {
            this.refreshCommentEntry(appComment);
        };

        this.onPostCommentReply = function(appCommentReply) {
            this.refreshCommentReplyEntry(appCommentReply);
        };

        /**
         * Called by CommentApp when deleting a comment before a response has been received from the server
         * @param {Object} appComment
         * @private
         */
        this.onDeleteComment = function(appComment) {
            this.removeComment(appComment);
            this.checkNoCommentsVisible();
            this.updateStatusBar();
            this.updateCommentsHeight();
        };

        /**
         * Called by CommentApp when deleting a commentReply before a response has been received from the server
         * @param {Object} appCommentReply
         * @private
         */
        this.onDeleteCommentReply = function(appCommentReply) {
            this.removeCommentReply(appCommentReply);
            this.updateCommentsHeight();
        };

        this.onUpdateComment = function(appComment) {
            this.refreshCommentEntry(appComment);
        };

        /**
         * Removes the attachments from a comment or from the "new comment" area.
         * @param {Object} [appComment] - Comment associated to the attachments.
         * @private
         */
        this.removeAllAttachments = function(appComment) {
            if (appComment) {
                // From a particular appComment //
                // Does not change appComment //
                var domElem = this.getPanelData(appComment, 'div-data');
                var container = domElem.attachments.container;
                while (container.lastChild) {
                    container.removeChild(container.lastChild);
                }
            } else {
                // From the "new comment" area //
                var list = this.attachmentsData.list;
                while (list.length > 0) {
                    this.deleteAttachmentItem(this.attachmentsData, list.pop());
                }
            }
        };

        /**
         * Creates UI for and appends an appAttachment to an appComment's UI and attachment list
         * @param {Object} appComment
         * @param {Object} appAttachment
         * @returns {Object|*}
         * @private
         */
        this.addAttachment = function(appComment, appAttachment) {
            var domElem = this.getPanelData(appComment, 'div-data');
            var ret = this.createAttachmentItem(domElem.attachments, appAttachment, appComment);
            ret.dataSource = appAttachment;
            return ret;
        };

        /**
         * Animates the screenCapture image moving from the viewer to the commentPanel.  Adds an image to a div
         * over the viewer and commentPanel and tweens it to the correct position, then adds the thumbnail
         * version of the image to the comment panel
         * @param {HTMLElement} container - the element that contains the viewer
         * @param {HTMLElement} destinationDiv - the destivate div that will contain the screenshot thumbnail
         * @param {Object} imageData - Object containing 3 values:
         *                              1. imageData - the dataURL of the screenCapture
         *                              2. imageWidth - Width of the image
         *                              3. imageHeight - Height of the image
         */
        this.animateScreenCapture = function(container, destinationDiv, imageData) {

            var transitionDelay = 400;
            var containerBounds = container.getBoundingClientRect();
            var containerWidth = containerBounds.right - containerBounds.left;
            var containerHeight = containerBounds.bottom - containerBounds.top;

            var position = this.getElementPosition(destinationDiv);
            var destinationStyle = window.getComputedStyle(destinationDiv);

            var finalHeight = parseInt(destinationStyle.height);
            var widthToHeight = imageData.imageWidth / imageData.imageHeight;
            var finalWidth = parseInt(finalHeight * widthToHeight);
            destinationDiv.style.width = finalWidth + "px";

            var screenCaptureContainer = document.createElement('div');
            screenCaptureContainer.className = "viewer-screenCaptureContainer";

            var screenCapturePhoto = document.createElement('div');
            screenCapturePhoto.className = "viewer-screenCapturePhoto";
            screenCapturePhoto.style.left = containerBounds.left + "px";
            screenCapturePhoto.style.top = containerBounds.top + "px";
            screenCapturePhoto.style.width = containerWidth + "px";
            screenCapturePhoto.style.height = containerHeight + "px";
            screenCapturePhoto.style.opacity = 1;

            // Fixes issue in Columbus
            if (settings.messageOverlayZIndex) {
                screenCapturePhoto.style.zIndex = (parseInt(settings.messageOverlayZIndex) + 1) + "";
            }
            this.parentContainer.appendChild(screenCapturePhoto);

            var screenCapture = new Image();
            screenCapture.className = "viewer-screenCapture";
            screenCaptureContainer.appendChild(screenCapture);
            screenCapture.onload = function() {
                var imageWidth = screenCapture.width;
                var imageHeight = screenCapture.height;

                self.parentContainer.appendChild(screenCaptureContainer);

                screenCaptureContainer.style.left = containerBounds.left + (containerWidth - imageWidth) * 0.5 + "px";
                screenCaptureContainer.style.top = containerBounds.top + (containerHeight - imageHeight) * 0.5 + "px";
                screenCaptureContainer.style.width = screenCapture.width + "px";
                screenCaptureContainer.style.height = screenCapture.height + "px";

                // Fixes issue in Columbus
                if (settings.messageOverlayZIndex) {
                    screenCaptureContainer.style.zIndex = settings.messageOverlayZIndex;
                }

                // create the thumb to replace the final scaled image
                var screenCaptureThumb = new Image();
                screenCaptureThumb.className = "commentPanel-entry-attachmentImg";
                screenCaptureThumb.src = imageData.imageData;

                // start css fade in of the screenshot
                window.requestAnimationFrame(function(){
                    screenCapturePhoto.style.opacity = 0;
                });

                // start css transition to scale and move the screenshot after a fade in delay
                window.setTimeout(function(){

                    self.parentContainer.removeChild(screenCapturePhoto);

                    var borderOffset = parseInt(window.getComputedStyle(destinationDiv).borderLeftWidth, 10) * 0.5;
                    screenCaptureContainer.style.left = position.x - borderOffset + "px";
                    screenCaptureContainer.style.top = position.y - borderOffset + "px";
                    screenCaptureContainer.style.width = finalWidth + "px";
                    screenCaptureContainer.style.height = finalHeight + "px";
                }, transitionDelay);

                // remove the transition container and append the thumbnail to the panel
                window.setTimeout(function() {
                    self.parentContainer.removeChild(screenCaptureContainer);
                    destinationDiv.innerHTML = "";
                    destinationDiv.appendChild(screenCaptureThumb);

                    // set the attachment div as filled which updates its CSS
                    if(typeof destinationDiv.setFilled === "function") {
                        destinationDiv.setFilled(true);
                    }
                }, 1400);
            };
            screenCapture.src = imageData.imageData;
        };

        /**
         * Hides/shows the status bar.
         * Also updates label displayed when a filterObject is passed
         * @param {Object} [filterObject]
         * @private
         */
        this.updateStatusBar = function(filterObject) {

            // Update visibility
            this.filterContainer.style.display = (this.commentDataList.length === 0) ? "none" : "block";

            // Current filter label
            if (filterObject) {
                var labelId = "status";
                if (filterObject.version !== Autodesk.Comments2.Constants.FILTER_VERSION_ANY) {
                    labelId += "_this_version";
                }
                if (filterObject.currentSheetOnly) {
                    labelId += "_this_sheet";
                }
                this.filterStatusSpan.innerHTML = this.locStrings[labelId];
            }
        };

        /**
         * Called by CommentApp when a new viewer is set.  This updates the comment tools available.
         * @param {Boolean} hasViewer - if there is a viewer present or not
         * @param {Boolean} is3d - if the viewer is for a 3d model or 2d sheet
         * @private
         */
        this.onViewerChange = function(hasViewer, is3d) {
            if(this.snapshotButton) {
                this.snapshotButton.style.display = hasViewer ? "block" : "none";
            }
            if (FRAMED_TOOLS.point.buttonInst){
                FRAMED_TOOLS.point.buttonInst.style.display = hasViewer ? "block" : "none";
            }
            if (FRAMED_TOOLS.object.buttonInst){
                FRAMED_TOOLS.object.buttonInst.style.display = (hasViewer && is3d) ? "block" : "none";
            }
        };

        this.setSheetGuidLabelMap = function(sheetGuidLabelMap) {
            this.sheetGuidLabelMap = sheetGuidLabelMap;
        };

        /**
         * Whenever a change in filters occurs.
         * @param filterObject
         */
        this.onFilterComments = function(filterObject) {
            this.checkNoCommentsVisible();
            this.updateStatusBar(filterObject);
        };

        /**
         * Checks if no comments are present. If so, presents a text to the user about it.
         */
        this.checkNoCommentsVisible = function() {

            if (this.commentDataList.length === 0) {
                this.divNoComment.innerHTML = this.locStrings["no_comments"];
                this.divNoComment.style.display = "block";
            } else {
                // Check if any comment is visible
                var scope = this; // Avoid .bind(this) due to A360 'bind' override.
                var anyCommentVisible = Autodesk.Comments2.arrayReduce(
                    this.commentDataList, false,
                    function(accumulator, commentPanelData){
                        return accumulator || scope.isCommentDivVisible(commentPanelData);
                    }
                );

                if (anyCommentVisible) {
                    this.divNoComment.style.display = "none";
                } else {
                    this.divNoComment.innerHTML = this.locStrings["no_comments_because_filters"];
                    this.divNoComment.style.display = "block";
                }
            }

        };

        /**
         * Sorts all comments given the rule specified in sortStrategy.
         * Applies to visible and hidden (filtered out) comments
         */
        this.onSortComments = function(appComments) {
            // remove all animation classes to prevent the animateIn animation from playing
            this.removeCommentEntryClasses(ANIMATE_IN);

            appComments.map(function(appComment){
                var entry = this.getPanelData(appComment, 'div-data');
                this.commentEntryContainer.appendChild(entry.container);
            }.bind(this));
        };

        /**
         * Updates the text for the number of responses in the response section of a Comment's UI.
         * @param {HTMLElement|span} responseSpan Span containing the text for number of responses.
         * @param {Object} comment Comment data.
         * @private
         */
        this.updateResponseText = function(responseSpan, appComment) {
            var spanText = this.formatTimestamp(appComment.dbComment.published);
            responseSpan.textContent = spanText;
        };

        /**
         * Checks if the post is valid and disables or enables the post comment buttons.
         * @param {HTMLElement|Input} - the button for posting the comment
         * @param {HTMLElement|Textarea} - The textarea for writing the comment body
         * @private
         */
        this.updatePostButtons = function(button, textArea) {
            var disableButtons = textArea.textContent.length === 0;
            button.disabled = disableButtons;
        };

        /**
         * Scrolls the CommentPanel so that the comment is at the top of the div.
         * @param {Object} appComment Comment data.
         * @private
         */
        this.scrollToComment = function(appComment) {
            var commentDiv = this.getPanelData(appComment, 'div-element');
            this.commentEntryContainer.scrollTop = commentDiv.offsetTop - this.commentEntryContainer.offsetTop;
        };

        /**
         * Sets the active display state of the comment entry
         * @param {Object} appComment
         * @param {Boolean} isActive
         * @param {Boolean} [allowDelete] allows the comment to be deleted, otherwise does the normal canDelete check
         */
        this.setCommentEntryActive = function(appComment, isActive, allowDelete) {
            var entry = this.getPanelData(appComment, 'div-element');
            if (entry) {
                var canDelete = allowDelete || this.canDeleteCommentEntry(appComment);
                var domElem = this.getPanelData(appComment, 'div-data');
                if (self.getPanelData(appComment, 'div-active') === isActive) {
                    return;
                }
                self.setPanelData(appComment, 'div-active', isActive);

                if (isActive) {
                    domElem.container.classList.add("selected");
                    if(canDelete) {
                        domElem.deleteButton.classList.remove("disabled");
                    }
                    if(domElem.text) {
                        domElem.text.classList.remove("commentPanel-ellipsis");
                    }
                } else {
                    domElem.container.classList.remove("selected");
                    if(canDelete) {
                        domElem.deleteButton.classList.add("disabled");
                    }
                    if(domElem.text) {
                        domElem.text.classList.add("commentPanel-ellipsis");
                    }

                    // Collapse reply box if opened
                    var replyDivData = this.getPanelData(appComment, 'reply-div-data');
                    if (replyDivData) {
                        replyDivData.setExpanded(false);
                    }
                }
            }

            this.updateCommentsHeight();
        };

        /**
         * Sets the active display state of a framed tool
         * @param {Object} framedToolName - the data associated with the framedTool
         * @private
         */
        this.setActiveFramedTool = function(framedToolName) {
            var framedToolData = null;
            switch(framedToolName) {
                case Autodesk.Comments2.Constants.FRAMED_TOOL_OBJECT:
                    framedToolData = FRAMED_TOOLS.object;
                    break;
                case Autodesk.Comments2.Constants.FRAMED_TOOL_POINT:
                    framedToolData = FRAMED_TOOLS.point;
                    break;
            }

            if(this.activeFramedTool !== null) {
                this.activeFramedTool.buttonInst.className = this.activeFramedTool.styleIdle;
                this.postTextArea.blur();
            }

            if(framedToolData !== null) {
                framedToolData.buttonInst.className = framedToolData.styleActive;
            }

            this.activeFramedTool = framedToolData;
        };

        /**
         * Override this method to do something when the user clicks on a comment's content.
         * @param {Object} appComment - Comment data.
         * @private
         */
        this.onCommentContentClick = function(appComment) {
            this.fireEvent( {type: this.EVENT_COMMENTS2_CLICK_COMMENT_ENTRY, data:appComment } );
        };

        /**
         * Sends an event to toggle a framed tool
         * @param {Object} toolData
         * @private
         */
        this.onFramedToolClick = function(toolData) {
            this.fireEvent( {type: this.EVENT_COMMENTS2_CLICK_FRAMED_TOOL, data:toolData.name } );
        };

        /**
         * Override this to do something when the user enters a comment marker.
         * @param {Object} node Node in the model Document.
         * @private
         */
        this.onCommentMarkerEnter = function(appComment) {
            this.fireEvent( {type: this.EVENT_COMMENTS2_ENTER_COMMENT_MARKER, data:appComment } );
        };

        /**
         * Override this to do something when the user leaves a comment marker.
         * @param {Object} appComment - Data associated with a comment.
         * @private
         */
        this.onCommentMarkerLeave = function(appComment) {
            this.fireEvent( {type: this.EVENT_COMMENTS2_LEAVE_COMMENT_MARKER, data:appComment } );
        };

        /**
         * Override this to get the panel's visibility.
         * @returns {boolean}
         * @private
         */
        this.isVisible = function () {
            if (!this.wrapper) {
                return false; //Panel not built yet. Thus, not visible.
            }
            var style = this.wrapper.style.display ? this.wrapper.style : window.getComputedStyle(this.wrapper);
            return style.display === 'block';
        };

        /**
         * Sets the visibility of the entire CommentPanel.
         * @param {boolean} visible
         * @private
         */
        this.setVisible = function (visible) {
            if (visible) {
                self.wrapper.style.display = 'block'; // TODO: want fade in
            } else {
                self.wrapper.style.display = 'none';
            }
            this.fireEvent({type:this.EVENT_COMMENTS2_CHANGE_PANEL_VISIBILITY, data:{visible:visible}});
        };

        /**
         * Sets the filter overlay's visibility.  If no value is provided, the visibility is toggled.
         * @param {boolean} [visible]
         * @private
         */
        this.setFilterOverlayVisible = function(visible) {

            if (typeof(visible) !== "boolean") {
                // Toggle the visibility
                var style = this.filterOverlay.display ? this.filterOverlay.style : window.getComputedStyle(self.filterOverlay);
                visible = (style.display !== "block");
            }
            this.filterOverlay.style.display = visible ? "block" : "none";

            if(visible) {
                this.filterContainerOptionsSpan.classList.add("selected");
                this.filterContainerOptionsImg.classList.add("selected");
            } else {
                this.filterContainerOptionsSpan.classList.remove("selected");
                this.filterContainerOptionsImg.classList.remove("selected");
            }
        };

        /**
         * Makes sure a comment fits in the panel by scrolling the panel to the bottom of the comment if it doesn't fit.
         * @param {Object} appComment
         * @private
         */
        this.fitCommentDivInPanel = function(appComment) {
            var commentDiv = this.getPanelData(appComment, 'div-element');
            var commentDivBottom = commentDiv.offsetTop + commentDiv.clientHeight;
            var commentContainerBottom = self.commentEntryContainer.offsetTop + self.commentEntryContainer.clientHeight;
            if(commentDiv.offsetTop < (self.commentEntryContainer.scrollTop + self.commentEntryContainer.offsetTop)) {
                self.commentEntryContainer.scrollTop = commentDiv.offsetTop - self.commentEntryContainer.offsetTop;
            }
            else if(commentDivBottom > (self.commentEntryContainer.scrollTop + commentContainerBottom)) {
                self.commentEntryContainer.scrollTop = Math.min(commentDivBottom - commentContainerBottom, commentDiv.offsetTop - self.commentEntryContainer.offsetTop);
            }
        };

        this.getCommentMarkerY = function(appComment) {
            var domViewer = document.getElementsByClassName('adsk-viewing-viewer')[0];
            var viewerPos = this.getElementPosition(domViewer);
            var commentLine = this.getPanelData(appComment, 'div-element');
            var commentPos = this.getElementPosition(commentLine, true);
            var paddingY = 46; // Distance from comment's top to the center of commentMarker (circle with number).
            return Math.floor(commentPos.y - viewerPos.y + paddingY - this.commentEntryContainer.scrollTop) + 0.5;
        };

        this.getNewCommentTextareaY = function() {
            var domViewer = document.getElementsByClassName('adsk-viewing-viewer')[0];
            var viewerPos = this.getElementPosition(domViewer);
            var commentLine = this.postTextArea;
            var commentPos = this.getElementPosition(commentLine, true);
            var commentStyle = commentLine.currentStyle || window.getComputedStyle(commentLine);
            var paddingY = parseInt(commentStyle.height) / 2;
            return Math.floor(commentPos.y - viewerPos.y + paddingY) + 0.5
        };

        /**
         * Helper method to create an element.
         * @param {string} element Type of element.
         * @param {string} type Type property.
         * @param {string} className Class name.
         * @param {string} value Vale property.
         * @param {Object} extra Extra properties to set.
         * @return {HTMLElement}
         * @private
         */
        this.createElement = function(element, type, className, value, extra) {
            var elem = document.createElement(element);
            if (type) {
                elem.type = type;
            }
            if (className) {
                elem.className = className;
            }
            if (value) {
                elem.value = value;
            }

            if (extra) {
                for (var key in extra) {
                    elem[key] = extra[key];
                }
            }

            return elem;
        };

        /**
         * Helper method to create a button.
         * @param {string} className
         * @param {string} text
         * @private
         */
        this.createButton = function(className, text) {
            var button = self.createElement("input", "submit", className, text);
            button.setAttribute("data-i18n", "[value]"+text );

            return button;
        };

        /**
         * Appends multiple children at once using a doc fragment.
         * @param {HTMLElement} parent
         * @param {Array} children - Array of HTMLElement (which is not really an array)
         * @private
         */
        this.appendMultiple = function(parent, children) {
            var docFragment = document.createDocumentFragment();

            for (var i = 0, len = children.length; i < len; ++i) {
                docFragment.appendChild(children[i]);
            }
            parent.appendChild(docFragment);
        };

        /**
         * Gets the position of an element in the comment panel.
         * @param {HTMLElement} element
         * @param {Boolean} [useRightBounds] If true, uses the right bounds of the element for the x pos, otherwise uses the
         * left bounds.
         * @param {Boolean} [useBottomBounds] If true, uses the bottom bounds of the element for the x pos, otherwise uses
         * the top bounds.
         * @returns {Object} Contains the x and y position of the element.
         * @private
         */
        this.getElementPosition = function(element, useRightBounds, useBottomBounds) {
            var xPosition = 0;
            var yPosition = 0;

            var originalElement = element;
            while(element) {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }

            if(useRightBounds) {
                xPosition += originalElement.offsetWidth;
            }

            if(useBottomBounds) {
                yPosition += originalElement.offsetHeight;
            }

            return { x: xPosition, y: yPosition };
        };

        /**
         * Converts a timestamp to the time format used in the comments.
         * @param {string|number} timestamp - Timestamp to be converted. Can be a string (UTC_string) or a number (ms since epoc)
         * @private
         */
        this.formatTimestamp = function(timestamp){

            var a = new Date(timestamp);
            var year = a.getFullYear();
            var month = a.getMonth() + 1;
            month = month < 10 ? ("0" + month) : month.toString();
            var date = a.getDate();
            date = date < 10 ? ("0" + date) : date.toString();
            var hour = a.getHours();
            var min = (a.getMinutes() < 10 ? "0" : "") + a.getMinutes();

            var label = month + '/' + date;
            if (year !== new Date().getFullYear()) {
                label += '/' + year;
            }
            label += ' ' + hour + ':' + min;
            return label;
        };

        /**
         * Adds a tootlip to an element
         * @param {HTMLElement}element
         * @param {String} text
         * @param eventManager
         * @param {String} direction - where to position the tooltip on the element
         * @private
         */
        this.addTooltip = function(element, text, eventManager, direction) {
            direction = direction || "top";
            var span = document.createElement("span");
            span.className = "commentPanel-tooltip";
            span.innerHTML = text;
            var tooltipContainer = this.parentContainer;
            var commentEntryContainer = this.commentEntryContainer;
            var accountForScroll = Autodesk.Comments2.isParentOf(element, commentEntryContainer);

            var onOver = function(e) {
                span.style.display = "block";

                var pos = self.getElementPosition(element);
                var offsetX = 0;
                var offsetY = 0;
                switch(direction) {
                    case "top":
                        offsetY = -span.offsetHeight;
                        break;
                    case "bottom":
                        offsetY = element.offsetHeight;
                        break;
                    case "left":
                        offsetX = -span.offsetWidth;
                        break;
                    case "right":
                        offsetX = element.offsetWidth;
                        break;
                }
                // account for scroll
                if (accountForScroll) {
                    offsetY -= commentEntryContainer.scrollTop;
                }
                span.style.top = (pos.y + offsetY) + "px";
                span.style.left = (pos.x + offsetX) + "px";
            };

            var onOut = function(e) {
                span.style.display = "none";
            };

            tooltipContainer.appendChild(span);
            eventManager.addEventListener(element, "mouseenter", onOver);
            eventManager.addEventListener(element, "mouseleave", onOut);

            this.tooltips[element] = {
                tooltip: span,
                eventManager: eventManager
            };
        };

        /**
         * Removes a tooltip from an element
         * @param {HTMLElement} element
         * @private
         */
        this.removeTooltip = function(element) {
            var tooltipData = this.tooltips[element];
            if(!tooltipData) {
                return;
            }

            tooltipData.eventManager.removeTargetsListeners(element);

            var tooltipContainer = this.parentContainer;
            tooltipContainer.removeChild(tooltipData.tooltip);

            delete this.tooltips[element];
        };

        /**
         * Calls on a function on focus out if the new element is not realted to the values provided
         * @param {Event} event - the original focus out event
         * @param {Array|HTMLElement} ignoreRelated - Either an array of or a HTMLElement to prevent the callback from executing
         * @param {Array|HTMLElement} ignoreParent - Either an array of or a HTMLElement to prevent the callback from executing
         * @param {Function} callback - the function to call on foucus out
         * @private
         */
        this.callOnFocusOut = function(event, ignoreRelated, ignoreParent, callback) {
            if(this.focusOutTimeout) {
                window.clearTimeout(this.focusOutTimeout);
                this.focusOutTimeout = null;
            }

            var containsRelatedTarget = function(target, valuesToCheck) {
                if(valuesToCheck) {
                    if(Array.isArray(valuesToCheck)) {
                        if(valuesToCheck.indexOf(target) > -1) {
                            return true;
                        }
                    }
                    else if (target === valuesToCheck) {
                        return true;
                    }
                }
                return false;
            };

            var checkRelated = function() {
                var parent = relatedTarget.parentNode;
                if(containsRelatedTarget(relatedTarget, ignoreRelated)) {
                    return;
                }

                if(containsRelatedTarget(parent, ignoreParent)) {
                    return;
                }

                callback();
            };

            var relatedTarget = event.relatedTarget;
            if(relatedTarget) {
                checkRelated();
            }
            else {
                this.focusOutTimeout = window.setTimeout(function(){
                    relatedTarget = document.activeElement;
                    checkRelated();
                }, 10);
            }
        };

        /**
         * Removes an array of classes from all the comment entries and replies.  This is used for removing
         * animations from comment entries so they don't replay after sorting comments which reads entries
         * back to the DOM
         * @param {Array} classNames
         * @private
         */
        this.removeCommentEntryClasses = function(classNames) {
            var classArray;
            if(Array.isArray(classNames)) {
                classArray = classNames;
            }
            else {
                classArray = [classNames];
            }

            for(var i = 0, len = this.commentDataList.length; i < len; ++i) {
                var dataPanel = this.commentDataList[i];
                var entry = dataPanel['div-element'];
                if (entry) {
                    DOMTokenList.prototype.remove.apply(entry.classList, classArray);
                }

                var replies = dataPanel['replies'];
                if(Array.isArray(replies)) {
                    for(var j = 0, rlen = replies.length; j < rlen; ++j) {
                        var replayDataPanel = replies[j];
                        var reply = replayDataPanel['div-data'];
                        if(reply && reply.container) {
                            DOMTokenList.prototype.remove.apply(reply.container.classList, classArray);
                        }
                    }
                }
            }

        };

        this.getNewPostTextAreaId = function() {
            return "comment2_new_post_div_area";
        };

        this.getNewReplyTextAreaId = function(appComment) {
            return "comment2_new_reply_div_area_" + appComment.dbComment.index;
        };

        // Viewer event handlers.
        /////////////////////////////////////////////////////////////////////////////


    };

    Autodesk.Comments2.CommentPanel.prototype.constructor = Autodesk.Comments2.CommentPanel;

// End closure
})();

namespaceFunction('Autodesk.Comment');

Autodesk.Comment.CommentService = function (options) {

    this.ENV_TABLE = {
        Local : {
            COMMENT : 'https://developer-dev.api.autodesk.com/comments/v2/',
            OBJECT_STORAGE: 'https://developer-dev.api.autodesk.com/oss/v1/'
        },
        Development : {
            COMMENT : 'https://developer-dev.api.autodesk.com/comments/v2/',
            OBJECT_STORAGE: 'https://developer-dev.api.autodesk.com/oss/v1/'
        },
        Staging : {
            COMMENT : 'https://developer-stg.api.autodesk.com/comments/v2/',
            OBJECT_STORAGE: 'https://developer-stg.api.autodesk.com/oss/v1/'
        },
        Production : {
            COMMENT : 'https://developer.api.autodesk.com/comments/v2/',
            OBJECT_STORAGE: 'https://developer.api.autodesk.com/oss/v1/'
        },
        AutodeskDevelopment : {
            COMMENT : 'https://developer-dev.api.autodesk.com/comments/v2/',
            OBJECT_STORAGE: 'https://developer-dev.api.autodesk.com/oss/v1/'
        },
        AutodeskStaging : {
            COMMENT : 'https://developer-stg.api.autodesk.com/comments/v2/',
            OBJECT_STORAGE: 'https://api-staging.autodesk.com/oss/v1/'
        },
        AutodeskProduction : {
            COMMENT : 'https://developer.api.autodesk.com/comments/v2/',
            OBJECT_STORAGE: 'https://api.autodesk.com/oss/v1/'
        }
    };

    this.CREDENTIALS = {
        OAUTH_2_TOKEN : Autodesk.Comment.OAuth2Token
    };

    this.PATH_STORAGE = null;
    this.FAKE_SERVER = false;
    this.FAKE_SERVER_DELAY = 200; // A small amount of delay
    this.NEXT_FAKE_ID = 11;

    this.initializeEnv = function (options) {
        if (options && options.env) {
            this.env = options.env;
        } else {
            this.env = "Development";
        }

        if (options && options.fakeServer) {
            this.FAKE_SERVER = true;
        }

        if (options && options.fakeSeverDelay) {
            this.FAKE_SERVER_DELAY = options.fakeSeverDelay;
        }
    };

    this.initializeServiceEndPoints = function () {
        var config = this.ENV_TABLE[this.env];
        this.COMMENT_SERVICE_URL = config['COMMENT'];
        this.OBJECT_STORAGE_SERVICE_URL = config['OBJECT_STORAGE'];
    };

    this.initialize = function (options) {
        this.initializeEnv(options);
        this.initializeServiceEndPoints();
    };

    this.createFakeRequest = function(operation, url, callbacks, callerFunction) {

        var self = this;
        var fakeRequest = {
            notifyCallback: function(fakeServerResponse) {
                if (self.FAKE_SERVER_DELAY) {
                    // Fake server response delay
                    setTimeout(function(){
                        callbacks.onLoad( fakeServerResponse );
                    },
                    self.FAKE_SERVER_DELAY);
                }
                else {
                    // invoke callback right away
                    callbacks.onLoad( fakeServerResponse );
                }
            },
            replyPostComment: function(args) {
                var dbComment = JSON.parse(args);
                dbComment.id =  self.NEXT_FAKE_ID++;
                dbComment.index = dbComment.id;
                dbComment.layoutName = dbComment.layoutName || "Another Sheet";
                if (!dbComment.actor) {
                    dbComment.actor = { name: (options && options.displayName) || "John Doe",
                        id: (options && options.oxygenId) || 'ABCDEFGHIJK' };
                }
                dbComment.published = new Date().toUTCString();
                this.notifyCallback( { currentTarget: {status: 200, responseText: JSON.stringify(dbComment)} } );
            },
            replyFetchLocationForNewOssAttachment: function() {
                var responseObject = {
                    attachment:[{url:"urn:adsk.objects:os.object:comments/filename"}]
                };
                this.notifyCallback( { currentTarget: {status: 200, responseText: JSON.stringify(responseObject)} } );
            },

            send: function(args) {

                switch(operation) {
                    case 'GET': //listComments
                        this.notifyCallback( { currentTarget: {status: 200, responseText: "[]"} } );
                        break;
                    case 'POST': //postComment or postCommentReply

                        switch(callerFunction) {
                            case "fetchLocationForNewOssAttachment":
                                this.replyFetchLocationForNewOssAttachment();
                                break;
                            default:
                                this.replyPostComment(args);
                                break;
                        }
                        break;

                    case 'DELETE': //deleteComment or deleteCommentReply
                        this.notifyCallback( { currentTarget: {status: 200, responseText: "{}"} } );
                        break;
                    case 'PUT':
                        try {
                            JSON.parse(args);
                            this.notifyCallback( { currentTarget: {status: 200, responseText: args} } );
                        }
                        catch(error) {
                            // send attachmentData
                            var attachmentResponse = {
                                objects:[{id: "test", key: "test", 'content-type': "image/png", location: "http://www.autodesk.com"}]
                            };

                            this.notifyCallback( { currentTarget: {status: 200, responseText: JSON.stringify(attachmentResponse)} } );
                        }
                        break;
                }
            },
            setRequestHeader: function (){}
        };
        return fakeRequest;
    };

    this.createRequest = function(operation, url, contentType, callbacks, callerFunction) {

        if (this.FAKE_SERVER) {
            return this.createFakeRequest(operation, url, callbacks, callerFunction);
        }

        var xhr = new XMLHttpRequest();
        xhr.open(operation, url, true);
        if(contentType) {
            xhr.setRequestHeader("Content-Type", contentType);
        }
        xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhr.setRequestHeader("Authorization", "Bearer " + this.CREDENTIALS.OAUTH_2_TOKEN);
        xhr.onload = callbacks.onLoad;
        xhr.onerror = callbacks.onError;
        xhr.ontimeout = callbacks.onTimeout;
        return xhr;
    };

    this.injectHeaders = function(xhr, additionalHeaders) {
        additionalHeaders && additionalHeaders.forEach(function(headerInfo) {
            xhr.setRequestHeader(headerInfo['name'], headerInfo['value']);
        });  
    };

    /**
     *
     * @param {Function} resolve
     * @param {Function} reject
     * @param {Boolean} [isBinaryData] Whether the response is to be binary or not (defaults to not-binary)
     * @returns {{onLoad: Function, onError: Function, onTimeout: Function}}
     */
    this.getAjaxCallback = function(resolve, reject, isBinaryData) {
        return {
            onLoad: function(event) {
                if (event.currentTarget.status == 200) {
                    resolve(isBinaryData ? event.currentTarget.response
                                         : event.currentTarget.responseText);
                } else {
                    reject();
                }
            },
            onError: function() {
                reject();
            },
            onTimeout: function() {
                reject();
            }
        }
    };

    this.listComments = function () {
        var self = this;
        return new Promise(function(resolve, reject){
            var url = [self.COMMENT_SERVICE_URL, 'resources/', self.PATH_STORAGE].join("");
            var callbacks = self.getAjaxCallback(resolve, reject);
            var xhr = self.createRequest('GET', url, 'text/plain', callbacks);
            xhr.send();
        });
    };

    this.postComment = function (commentObj, additionalHeaders) {
        var self = this;
        return new Promise(function(resolve, reject){
            var url = [self.COMMENT_SERVICE_URL, 'resources/', self.PATH_STORAGE].join("");
            var callbacks = self.getAjaxCallback(resolve, reject);
            var xhr = self.createRequest('POST', url, 'text/plain', callbacks);
            self.injectHeaders(xhr, additionalHeaders);
            xhr.send(JSON.stringify(commentObj));
        });
    };

    this.postCommentReply = function(commentObj, parentCommentId) {
        var self = this;
        return new Promise(function(resolve, reject){
            var base64 = window.encodeURIComponent(Autodesk.Comments2.Utils.encodePhrase(parentCommentId));
            var url = [self.COMMENT_SERVICE_URL, 'resources/', base64].join("");
            var callbacks = self.getAjaxCallback(resolve, reject);
            var xhr = self.createRequest('POST', url, 'text/plain', callbacks);
            xhr.send(JSON.stringify(commentObj));
        });
    };

    this.deleteComment = function (commentId) {
        var self = this;
        return new Promise(function(resolve, reject){
            var encodedId = Autodesk.Comments2.Utils.encodePhrase(commentId);
            var base64 = window.encodeURIComponent(encodedId);
            var url = [self.COMMENT_SERVICE_URL, 'resources/', base64].join("");
            var callbacks = self.getAjaxCallback(resolve, reject);
            var xhr = self.createRequest('DELETE', url, 'text/plain', callbacks);
            xhr.send();
        });
    };

    this.fetchLocationForNewOssAttachment = function(additionalHeaders, callbacks) {
        var url = [this.COMMENT_SERVICE_URL, 'resources/', this.PATH_STORAGE, '/attachment'].join("");
        var xhr = this.createRequest('POST', url, 'application/json', callbacks, "fetchLocationForNewOssAttachment");
        this.injectHeaders(xhr, additionalHeaders);
        xhr.send();
    };

    this.getAttachment = function(urn, dataType, additionalHeaders) {
        var self = this;
        return new Promise(function(resolve, reject){
            var dataParts = self.extractOssBucketAndId(urn);
            var url = [self.OBJECT_STORAGE_SERVICE_URL, 'buckets/', dataParts[0], '/objects/', dataParts[1]].join("");
            var isBinaryData = (dataType === Autodesk.Comments2.Constants.ATTACHMENT_DATA_TYPE_BINARY);
            var callbacks = self.getAjaxCallback(resolve, reject, isBinaryData);
            var xhr = self.createRequest('GET', url, null, callbacks);
            self.injectHeaders(xhr, additionalHeaders);
            if (isBinaryData) {
                xhr.responseType = 'arraybuffer';
            }
            xhr.send();
        });
    };

    this.postAttachment = function(objectKey, fileData, bucketId, additionalHeaders, callbacks) {
        var url = [this.OBJECT_STORAGE_SERVICE_URL, 'buckets/', bucketId, '/objects/', objectKey].join("");
        var xhr = this.createRequest('PUT', url, 'text/plain', callbacks);
        this.injectHeaders(xhr, additionalHeaders);
        xhr.send(fileData);
    };

    this.deleteAttachment = function(objectKey, bucketId, callbacks) {
        var url = [this.OBJECT_STORAGE_SERVICE_URL, 'buckets/', bucketId, '/objects/', objectKey].join("");
        var xhr = this.createRequest('DELETE', url, 'text/plain', callbacks);
        xhr.send();
    };

    /**
     * Extracts the bucket id and the attachment id from an OSS URN.
     * @param {String} ossUrn
     * @returns {Array} With values: [ <bucket_id>, <attachment_id> ]
     */
    this.extractOssBucketAndId = function(ossUrn) {
        var dataParts = ossUrn.split('/'); // Returns 2 array with 2 elements [ <stuff + bucket_id>, <attachment_id> ]
        var bucketId = dataParts[0];            // Something like 'urn:adsk.objects:os.object:comments'
        var tmpArray = bucketId.split(':');     // We need to get 'comments' at the end.
        dataParts[0] = tmpArray[tmpArray.length-1];
        return dataParts;
    };

    this.initialize(options);
};
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.CommentsViewer = function(args) {

    //////////////////////
    // member variables //
    //////////////////////

    var self = this;
    var LOC_TABLE = Autodesk.Comments2.Localization;

        // Constants
    var SHOW_MARKERS_PREF_ID = 'showCommentMarkers',
        CONTEXT_MENU_ID = 'Comments2',
        VIEWER_STATE_FILTER_RESTORE = true, // We want it all back!
        RESTORE_IS_IMMEDIATE = false,       // We want to animate towards the restored state (ex: camera lerps)
        VIEWER_STATE_FILTER_GET = {
            seedURN: true,
            objectSet: true,
            viewport: true,
            tags: true,             // Animation extension uses tags.
            renderOptions: false,
            cutplanes: true
        };

        // Events
    this.EVENT_COMMENTS2_VIEWER_READY = 'EVENT_COMMENTS2_VIEWER_READY';
    this.EVENT_COMMENTS2_ESCAPE_CREATE_MARKUPS = 'EVENT_COMMENTS2_ESCAPE_CREATE_MARKUPS';
    this.EVENT_COMMENTS2_CLICK_VIEWER_MARKER = 'EVENT_COMMENTS2_CLICK_VIEWER_MARKER';
    this.EVENT_COMMENTS2_ENTER_VIEWER_MARKER = 'EVENT_COMMENTS2_ENTER_VIEWER_MARKER';
    this.EVENT_COMMENTS2_LEAVE_VIEWER_MARKER = 'EVENT_COMMENTS2_LEAVE_VIEWER_MARKER';
    this.EVENT_COMMENTS2_REQUEST_FOCUS_TO_POST_COMMENT = 'EVENT_COMMENTS2_REQUEST_FOCUS_TO_POST_COMMENT';
    this.EVENT_COMMENTS2_REQUEST_CAPTURE_IMAGE = 'EVENT_COMMENTS2_REQUEST_CAPTURE_IMAGE';
    this.EVENT_COMMENTS2_FRAMED_TOOLS_CANCELED = 'EVENT_COMMENTS2_FRAMED_TOOLS_CANCELED';
    this.EVENT_COMMENTS2_REQUEST_UNSELECT_COMMENT = 'EVENT_COMMENTS2_REQUEST_UNSELECT_COMMENT';
    this.EVENT_COMMENTS2_REQUEST_CONTEXT_MENU_COMMENT = 'EVENT_COMMENTS2_REQUEST_CONTEXT_MENU_COMMENT';
    this.EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT = 'EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT';
    this.EVENT_COMMENTS2_MARKUPS_RESTORED = 'EVENT_COMMENTS2_MARKUPS_RESTORED';

        // Exposed
    this.viewer = null;
    this.settings = args.settings;
    this.framedToolActive = null;
    this.markerEventManager = null;
    this.drawingLinePostNewComment = false;
    this.commentPanelVisibile = false;

    // setup() will add the following methods:
    // - addEventListener
    // - hasEventListener
    // - removeEventListener
    // - fireEvent
    // as well as the member variable:
    // - this.listeners = []
    Autodesk.Comments2.addTrait_eventDispatcher(this);

    //////////////////////
    // Public functions //
    //////////////////////

    this.initialize = function() {

        var viewerInst = args.viewer;
        if (viewerInst) {
            this.setViewer(viewerInst);
        }

        this.markerEventManager = new Autodesk.Comment.EventManager();
    };

    this.destroy = function() {
        if(this.markers) {
            this.markers.clearMarkers();
        }
        this.deinitializeViewerInstance();
        this.markerEventManager.destroy();
        Autodesk.Comments2.remTrait_eventDispatcher(this);
    };

    this.restoreState = function(appComment, triggeredByPanel) {
        var viewerStateData = appComment.dbComment;
        // Support comments with no sectioning data
        if (!Array.isArray(viewerStateData.cutplanes)) {
            viewerStateData.cutplanes = [];
        }
        this.viewer.restoreState(viewerStateData, VIEWER_STATE_FILTER_RESTORE, RESTORE_IS_IMMEDIATE);
        this.viewerStateTransitionInitiatedByPanel = triggeredByPanel;
        this.fetchAndRestoreMarkups(appComment);
    };

    this.fetchAndRestoreMarkups = function(appComment) {

        if (!Autodesk.Comments2.featureEnabled(this.settings, 'annotations')) {
            return;
        }

        // Fetch/Restore markups (if any)
        var markupAppAttachment = Autodesk.Comments2.arrayReduce(
            appComment.attachments, null,
            function(result, appAttachment) {
                if (result) {
                    return result;
                }
                if (appAttachment.type === Autodesk.Comments2.Constants.ATTACHMENT_TYPE_MARKUP) {
                    return appAttachment;
                }
                return null;
            }
        );
        // Abort if nothing to do
        if (!markupAppAttachment) {
            return;
        }
        if (markupAppAttachment.data) {
            // ready to restore
            this.setLoadingMarkups();
            // We need to wait for the camera rotation to complete before actually loading markups
            Autodesk.Comments2.notifyNavigationComplete(this.viewer, function(){
                this.restoreMarkup(markupAppAttachment);
            }.bind(this));
        } else {
            // download data first
            this.annotationsEditor.enterViewMode(); // Preemptive enter edit mode
            this.setLoadingMarkups();

            var onOssMarkupDataReceived = function(markupData) {
                markupAppAttachment.data = markupData;
                // We need to wait for the camera rotation to complete before actually loading markups
                Autodesk.Comments2.notifyNavigationComplete(this.viewer, function(){
                    this.restoreMarkup(markupAppAttachment);
                }.bind(this));
            }.bind(this);
            var data2 = {
                dataType: Autodesk.Comments2.Constants.ATTACHMENT_DATA_TYPE_TEXT,
                callback: onOssMarkupDataReceived,
                ossPath: markupAppAttachment.ossPath,
                appAttachment: markupAppAttachment
            };
            this.fireEvent({ type:this.EVENT_COMMENTS2_FETCH_OSS_ATTACHMENT, data: data2 });
        }
    };

    this.setLoadingMarkups = function() {
        var data = {
            appAttachment: null // Sending null to signal that a loading is still required.
        };
        this.fireEvent({ type:this.EVENT_COMMENTS2_MARKUPS_RESTORED, data: data });
    };

    this.restoreMarkup = function(markupAppAttachment) {
        if (!this.annotations) {
            return;
        }
        var markupDataStr = markupAppAttachment.data;
        var svgNode = Autodesk.Comments2.stringToSvgNode(markupDataStr);
        this.annotations.restoreFromDiv(svgNode);
        this.annotationsEditor.enterViewMode();

        var data = {
            appAttachment: markupAppAttachment
        };
        this.fireEvent({ type:this.EVENT_COMMENTS2_MARKUPS_RESTORED, data: data });
    };

    this.exitMarkupModes = function() {
        // Need to watch out for disabled feature.
        if (this.annotationsEditor) {
            this.annotationsEditor.cancelEditMode();
            this.annotationsEditor.exitViewMode();
        }
    };

    /**
     *
     * @param callback
     * @param {Boolean} [includeMarkers] True to include markers.
     * @param {Boolean} [includeAnnotations] True to include annotations.
     */
    this.screenCapture = function(callback, includeMarkers, includeAnnotations) {
        Autodesk.Comments2.screenCapture(
            this.viewer,
            includeMarkers ? this.markers : null,
            includeAnnotations ? this.annotationsEditor : null, callback);
    };

    this.setViewer = function(viewer) {
        this.deinitializeViewerInstance();
        this.initializeViewerInstance(viewer);
    };

    this.createSnapshot = function() {

        // TODO: Revisit this restriction
        // Comments don't support selection in 2d sheets
        // Reason: There is a technical issue with Viewer Markers for selected elements in 2d sheets.
        if (this.viewer && this.viewer.model && this.viewer.model.is2d()) {
            this.viewer.clearSelection();
        }

        // Only account for selection when 'markups' feature is enabled
        if (!Autodesk.Comments2.featureEnabled(this.settings, "markups")) {

            this.viewer && this.viewer.clearSelection();
        }
        // Make sure pin tool selects its node.
        this.restorePinToolSelection();

        if (this.viewer) {
            var viewerState =  this.viewer.getState( VIEWER_STATE_FILTER_GET );
            var model = this.viewer.model;
            var globalOffset = model ? model.getData().globalOffset : null;
            if (globalOffset) { // globalOffset is null for 2d models.
                Autodesk.Comments2.LmvUtils.applyOffsetToCamera(viewerState.viewport, globalOffset);
            }
            return viewerState;
        }
        return {};
    };

    this.onCreateAppComment = function(appComment) {
        appComment["viewer-data"] = {
            'marker-id' : null  // Gets populated with the acknowledgement of a post() to backend.
        };
    };

    this.onDeleteComment = function(appComment) {
        if (appComment["marker-id"]) {
            this.markers.removeMarker(appComment["marker-id"]);
        }
    };

    ///////////////////////////
    //// Private functions ////
    ///////////////////////////

    /**
     * Whether the viewer is in a state that allows for restoreState() to not fail.
     * @returns {boolean}
     */
    this.canRestoreComment = function() {
        if (!this.viewer) {
            return false;
        }
        // Check for GEOMETRY_LOADED_EVENT
        var model = this.viewer.model;
        if (!model || !model.isLoadDone()) {
            return false;
        }

        return true;
    };

    /**
     * Initializes comment markers and a viewerState (optional) when the viewer is
     * ready to be fully used.
     */
    this.onGeometryLoaded = function() {

        this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryLoaded);
        var loadedModel = this.viewer.model;

        if (!loadedModel.myData || !loadedModel.myLoader) {
            // getObjectTree returns early under these conditions.
            // We will take it as a non-issue and consider the viewer fully loaded.
            this.fireEvent(this.EVENT_COMMENTS2_VIEWER_READY);
            return;
        }

        if (this.viewer.model.is2d()) {
            // Also return early for 2d models.
            this.fireEvent(this.EVENT_COMMENTS2_VIEWER_READY);
            return;
        }

        // Wait until the ObjectTree is loaded (or can't be loaded)
        var that = this;
        this.viewer.model.getObjectTree(
            function() {
                // On success //
                // ObjectTree is available and loaded, viewer is now fully loaded.
                that.fireEvent(that.EVENT_COMMENTS2_VIEWER_READY);
            },
            function() {
                // On failure //
                // ObjectTree is NOT available, we can consider the viewer to be fully loaded at this point.
                that.fireEvent(that.EVENT_COMMENTS2_VIEWER_READY);
            }
        );
    }.bind(this);

    /**
     * Stores the bounds of the viewer when it is resized
     */
    this.onViewerResize = function() {
        var container = this.viewer.container;
        this.viewerBounds = {
            left: 0,
            top: 0,
            right: container.clientWidth,
            bottom: container.clientHeight
        };
    }.bind(this);


    /**
     * DeInitializes the viewer instance cached, removing listeners and settings
     * internal values to null.
     */
    this.deinitializeViewerInstance = function() {
        if (!this.viewer) {
            return;
        }

        try {
            // May fail when destroying the full viewer but NOT when changing the active sheet
            // (aka loading another model)
            this.viewer.unregisterContextMenuCallback(CONTEXT_MENU_ID);
        } catch (err) { /*Let it pass*/ }

        // Remove events from old viewer
        this.viewer.removeEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryLoaded);
        this.viewer.removeEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewerResize);
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);
        this.viewer.removeEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, this.onExplodeChange);

        // FramedToolCancelled
        if (this.pinTool && this.pinTool.EVENT_LEAVE_EDIT_MODE) {
            this.viewer.removeEventListener(this.pinTool.EVENT_LEAVE_EDIT_MODE, this.onFramedToolCancelled);
        }
        if (this.viewerSelector && this.viewerSelector.EVENT_LEAVE_EDIT_MODE) {
            this.viewer.removeEventListener(this.viewerSelector.EVENT_LEAVE_EDIT_MODE, this.onFramedToolCancelled);
        }
        // FramedToolChanged
        if (this.pinTool && this.pinTool.EVENT_SELECTION_CHANGED) {
            this.viewer.removeEventListener(this.pinTool.EVENT_SELECTION_CHANGED, this.onFramedToolChanged);
        }
        if (this.viewerSelector && this.viewerSelector.EVENT_SELECTION_CHANGED) {
            this.viewer.removeEventListener(this.viewerSelector.EVENT_SELECTION_CHANGED, this.onFramedToolChanged);
        }

        // Remove comments button from toolbar
        if (this.viewerToolbarCommentBtn) {
            if (this.viewer.modelTools) {
                this.viewer.modelTools.removeControl(this.viewerToolbarCommentBtn.getId());
            }
            this.viewerToolbarCommentBtn = null;
        }

        // DeInitialize viewer
        this.annotations = null;
        this.annotationsEditor = null;
        this.viewer = null;
        this.framedToolActive = null;
    };

    /**
     * Loads extensions and initializes tools. Integrates with the viewer.
     * @param {Object} viewer - Viewer instance
     */
    this.initializeViewerInstance = function(viewer) {

        if (!this.isViewerCompatible(viewer) && viewer.impl) {
            return;
        }

        this.viewer = viewer;

        if (!this.viewerExtensionInitialized) {
            Autodesk.Comments2.importAnnotations();
            Autodesk.Comments2.importAnnotationsEditor();
            Autodesk.Comments2.importViewerMarkers();
            Autodesk.Comments2.importViewerPinTool();
            Autodesk.Comments2.importViewerSelector();
            this.viewerExtensionInitialized = true;
        }

        this.viewer.loadExtension('Autodesk.Comments2.Annotations');
        this.viewer.loadExtension('Autodesk.Comments2.AnnotationsEditor');
        this.viewer.loadExtension('Autodesk.Comments2.Markers');
        this.viewer.loadExtension('Autodesk.Comments2.PinTool');
        this.viewer.loadExtension('Autodesk.Comments2.ViewerSelector');

        this.annotations = viewer.loadedExtensions['Autodesk.Comments2.Annotations'];
        this.annotationsEditor = viewer.loadedExtensions['Autodesk.Comments2.AnnotationsEditor'];
        this.markers = viewer.loadedExtensions['Autodesk.Comments2.Markers'];
        this.pinTool = viewer.loadedExtensions['Autodesk.Comments2.PinTool'];
        this.viewerSelector = viewer.loadedExtensions['Autodesk.Comments2.ViewerSelector'];

        // Add Context Menu comments entry
        viewer.registerContextMenuCallback(CONTEXT_MENU_ID, function (menu, status) {
            menu.push({
                title: LOC_TABLE.post_new_comment_context_menu,
                target: function () {
                    this.fireEvent({type: this.EVENT_COMMENTS2_REQUEST_CONTEXT_MENU_COMMENT});
                }.bind(this)
            });
        }.bind(this));

        // Add Toolbar Comments button
        this.initCommentsToolbarButtons(viewer);

        // framed tools changed listeners
        if (this.annotationsEditor) {
            viewer.addEventListener(this.annotationsEditor.EVENT_SELECTION_CHANGED, this.onFramedToolChanged);
            viewer.addEventListener(this.annotationsEditor.EVENT_LEAVE_EDIT_MODE, this.onFramedToolCancelled);
        }

        // framed tools cancel listeners
        if (this.pinTool && this.pinTool.EVENT_LEAVE_EDIT_MODE) {
            viewer.addEventListener(this.pinTool.EVENT_LEAVE_EDIT_MODE, this.onFramedToolCancelled);
        }
        if (this.viewerSelector && this.viewerSelector.EVENT_LEAVE_EDIT_MODE) {
            viewer.addEventListener(this.viewerSelector.EVENT_LEAVE_EDIT_MODE, this.onFramedToolCancelled);
        }
        // framed tools changed listeners
        if (this.pinTool && this.pinTool.EVENT_SELECTION_CHANGED) {
            viewer.addEventListener(this.pinTool.EVENT_SELECTION_CHANGED, this.onFramedToolChanged);
        }
        if (this.viewerSelector && this.viewerSelector.EVENT_SELECTION_CHANGED) {
            viewer.addEventListener(this.viewerSelector.EVENT_SELECTION_CHANGED, this.onFramedToolChanged);
        }

        // camera related members
        this.cameraTransitionActive = false;
        this.currentCameraUp = new THREE.Vector3();
        this.currentCameraLeft = new THREE.Vector3();
        this.previousCameraUp = new THREE.Vector3();
        this.previousCameraLeft = new THREE.Vector3();

        viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);
        viewer.addEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, this.onExplodeChange);

        if (this.canRestoreComment()) {
            this.onGeometryLoaded();
        } else {
            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, this.onGeometryLoaded);
        }

        // store the current bounds of the viewer
        this.viewer.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewerResize);
        this.onViewerResize();
    };

    this.initCommentsToolbarButtons = function(viewer) {

        // Check to make sure the new toolbar API is available
        // Currently, staging does not have access to the toolbar API.
        // The comments buttons and menu won't show there right now
        if (!Autodesk.Viewing.UI.Button) {
            return;
        }

        // Only add button when markers are a thing
        if (Autodesk.Comments2.featureEnabled(this.settings, "markups")) {
            this.injectCommentToolbarButton(viewer);
        }
    };

    this.injectCommentToolbarButton = function(viewer) {

        var AVU = Autodesk.Viewing.UI;
        var VIEWER_COMMENT_TOOLBAR_BUTTON_ID = "toolbar-commentButton";

        var defaultValue = true;
        var prefs = viewer.prefs;
        prefs.add(SHOW_MARKERS_PREF_ID, defaultValue, ['2d', '3d']);

        // viewer toolbar button
        this.viewerToolbarCommentBtn = new AVU.Button(VIEWER_COMMENT_TOOLBAR_BUTTON_ID);
        this.viewerToolbarCommentBtn.onClick = function () {
            self.onToggleMarkerVisibility();
        };
        if (!prefs.get(SHOW_MARKERS_PREF_ID)) {
            this.viewerToolbarCommentBtn.addClass("off");
            this.viewerToolbarCommentBtn.setToolTip(LOC_TABLE.show_markers_tooltip);
        } else {
            this.viewerToolbarCommentBtn.setToolTip(LOC_TABLE.hide_markers_tooltip);
        }

        var createUIFn = function() {
            viewer.modelTools.addControl(self.viewerToolbarCommentBtn, {index: 0});
        };

        if (viewer.modelTools) {
            createUIFn();
        } else {
            viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
        }

        function onToolbarCreated() {
            viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, onToolbarCreated);
            createUIFn();
        }
    };

    this.onCameraChange = function () {

        if (!this.isModelLoaded()) {
            return;
        }

        // if camera is panning or zooming left and up vectors don't change at all.
        var camera = this.viewer.impl.camera;
        var cameraWorld = camera.matrixWorld.elements;

        this.currentCameraLeft.set(cameraWorld[0],cameraWorld[1], cameraWorld[2]);
        this.currentCameraUp.set(cameraWorld[4],cameraWorld[5], cameraWorld[6]);

        // Several camera change events while the camera is not being modified are fired after a camera transition ended.
        // This is a side effect of a solution used to avoid extreme flickering (progressive rendering is delayed some
        // milliseconds after the camera stops moving).
        // ToolController has a property that states if the camera was dirty and truly updated.
        // After a navigation transition ends, the camera stays dirty one more frame.
        // For that reason, to know if the camera change was made by the user the previous frame is checked too.
        var transitionActive = this.viewer.navigation.getTransitionActive();
        var cameraUpdated = this.viewer.toolController.cameraUpdated;
        var changedByUser = !transitionActive && !this.cameraTransitionActive;
        var changedByPanel = !changedByUser && this.viewerStateTransitionInitiatedByPanel;
        var markupsLoaded = this.isModelLoaded();

        if (cameraUpdated && markupsLoaded && (changedByUser || !changedByPanel)) {

            var isCameraZoomingOrPanning =
                this.currentCameraUp.distanceToSquared(this.previousCameraUp) < 0.000001 &&
                this.currentCameraLeft.distanceToSquared(this.previousCameraLeft) < 0.000001;

            if (camera.isPerspective || !isCameraZoomingOrPanning) {

                // Only unselect a markup comment.
                this.fireEvent(this.EVENT_COMMENTS2_REQUEST_UNSELECT_COMMENT);
            }
        }

        this.previousCameraLeft.copy(this.currentCameraLeft);
        this.previousCameraUp.copy(this.currentCameraUp);

        this.viewerStateTransitionInitiatedByPanel = transitionActive && this.viewerStateTransitionInitiatedByPanel;
        this.cameraTransitionActive = transitionActive;

    }.bind(this);

    this.onExplodeChange = function () {

        // Only attempt to clear the snapshot when manually changing the explode value (through UI)
        /*if (this.viewerStateTransitionInitiatedByPanel || this.cameraTransitionActive) {
            // Only unselect a markup comment.
                this.fireEvent(this.EVENT_COMMENTS2_REQUEST_UNSELECT_COMMENT);
            }

        }*/
    }.bind(this);


    /**
     *  Returns whether the model is loaded or not.
     *
     * @returns {Boolean} - Whether the model is loaded or not.
     * @private
     */
    this.isModelLoaded = function() {
        return this.viewer && this.viewer.model && this.viewer.model.isLoadDone();
    };

    this.getTransitionActive = function() {
        return this.viewer && this.viewer.navigation && this.viewer.navigation.getTransitionActive();
    };

    this.setMarkersVisible = function(isVisible) {
        this.markers && this.markers.setMarkersVisible(isVisible);
    };

    this.onToggleMarkerVisibility = function() {
        var prefs = this.viewer.prefs;
        var markersVisible = !prefs.get(SHOW_MARKERS_PREF_ID);
        if(markersVisible) {
            this.viewerToolbarCommentBtn.removeClass("off");
            this.viewerToolbarCommentBtn.setToolTip(LOC_TABLE.hide_markers_tooltip);
        } else {
            this.viewerToolbarCommentBtn.addClass("off");
            this.viewerToolbarCommentBtn.setToolTip(LOC_TABLE.show_markers_tooltip);
        }

        prefs.set(SHOW_MARKERS_PREF_ID, markersVisible, true);
        this.annotations.update();
        this.markers && this.markers.updateMarkersVisibility();
        this.markers && this.markers.update();
    };


    /**
     * Highlights the geometry associated to a node-comment.
     * @param {Object} appComment
     */
    this.setCommentGeometryHighlight = function(appComment) {
        if (!this.isViewerCompatible(this.viewer)){
            return;
        }
        if (!this.isModelLoaded()){
            return;
        }
        if (this.viewer.model.is2d()) {
            return;
        }
        var nodesToHighlight = appComment["highlight-node-ids"];
        if (!nodesToHighlight || nodesToHighlight.length === 0) {
            return;
        }

        var nodesToHighlightLength = nodesToHighlight.length;
        for (var i = 0; i < nodesToHighlightLength; ++i) {
            this.markers.highlightNode(nodesToHighlight[i], appComment.id);
        }
    };

    /**
     * Removes geometry highlight associated to a node-comment.
     * @param {Object} appComment
     */
    this.clearCommentGeometryHighlight = function(appComment) {
        if (!this.isModelLoaded()){
            return;
        }
        if (appComment['marker-id'] === null) {
            return;
        }
        if (this.viewer.model.is2d()) {
            return;
        }
        var nodes = appComment["highlight-node-ids"];
        var nodesLength = nodes.length;
        for(var i = 0; i < nodesLength; ++i) {
            this.markers.clearHighlightedNode(nodes[i], appComment.id);
        }
    };


    /**
     * Clears the currently selected nodes in the viewer and then selects all nodes the comment is attached too.
     * If the comment is not assigned to any nodes, highlights the entire model.
     * @param {Object} comment Data associated with a comment.
     * @private
     */
    this.replaceSelectionWithCommentHighlights = function(comment) {

        if (!this.viewer || !this.annotations) {
            return;
        }
        if (this.viewer.model.is2d()) {
            return;
        }

        var selector = this.viewer.impl ? this.viewer.impl.selector : null;
        if (selector) {
            selector.clearSelection();
        }

        if (this.isNodeComment(comment)) {
            var model = this.viewer.model;
            if (model) {
                var nodes = comment["highlight-node-ids"];
                var nodesLength = nodes.length;
                for (var i = 0; i < nodesLength; ++i) {
                    this.annotations.highlightNode(nodes[i]);
                }
            }
        }
    };

    /**
     * Returns true if viewer is compatible with comment panel.
     * @param viewer
     * @returns {boolean}
     * @private
     */
    this.isViewerCompatible = function(viewer) {
        return viewer !== null && viewer instanceof Autodesk.Viewing.Viewer3D;
    };

    /**
     * Enter annotation edit mode.
     */
    this.enterAnnotationsEditMode = function () {

        this.annotationsEditor.enterEditMode();
    };
    /**
     * Leave annotation edit mode.
     */
    this.leaveAnnotationsEditMode = function () {

        this.annotationsEditor.leaveEditMode();
    };
    /**
     * Cancel annotation edit mode.
     */
    this.cancelAnnotationsEditMode = function () {

        this.annotationsEditor.cancelEditMode();
    };

    this.getMarkupsData = function() {

        this.annotationsEditor.saveMetadata();
        var divAnnotations = this.annotationsEditor.getDivAnnotations();
        return Autodesk.Comments2.svgNodeToString(divAnnotations);
    };

    /**
     * Remove the annotations from view
     */
    this.clearAnnotations = function() {

        this.annotationsEditor.clear();
    };

    this.onFramedToolChanged = function(event) {
        var tool = event.target;

        // Avoid focusing when tools have nothing selected
        if (tool === this.viewerSelector && this.viewerSelector.selectedNodeId === -1) {
            return;
        }
        if (tool === this.pinTool && !this.pinTool.hasSelection) {
            this.pinToolSelection = null;
            return;
        }

        // For pinTool, when a selection is made, leave tool mode
        if (tool === this.pinTool && "selectedNodeId" in this.pinTool && this.pinTool.hasSelection) {

            // Before cancelling out of the tool, we need to cache some data
            var pinToolSelection = {
                selectedNodeId: this.pinTool.selectedNodeId,
                selectedNodeOffset: this.pinTool.selectedNodeOffset.clone()
            };

            this.cancelFramedTools();
            this.pinToolSelection = pinToolSelection;
        }

        // Since events come from click, we need to delay the call...
        window.requestAnimationFrame(function(){
            self.fireEvent(self.EVENT_COMMENTS2_REQUEST_FOCUS_TO_POST_COMMENT);

            // Capture image if we got to this state
            /*
            // TODO: Evaluate with the committee whether we want this enhancement or not.
            setTimeout(function() {
                self.fireEvent(self.EVENT_COMMENTS2_REQUEST_CAPTURE_IMAGE);
            }, 100);
            */
        });

    }.bind(this);

    /**
     * Handler for when framed tools get cancelled through the viewer's 'cancel' button.
     * @param [Object} args - event args
     *                 {String} args.type - event type
     *                 {Object} args.target - event dispatcher, the extension.
     * @private
     */
    this.onFramedToolCancelled = function(args) {
        this.setActiveFramedTool(null,null);

        this.pinToolSelection = null;

        if (this.annotationsEditor && args.type === this.annotationsEditor.EVENT_LEAVE_EDIT_MODE) {
            // We need to cancel out MarkupsActionBar as well.
            this.fireEvent(this.EVENT_COMMENTS2_ESCAPE_CREATE_MARKUPS);
        }
        else { // dispatch an event to notify the CommentPanel UI to update
            this.fireEvent(this.EVENT_COMMENTS2_FRAMED_TOOLS_CANCELED);
        }

    }.bind(this);

    this.clearPinToolSelection = function() {
        this.pinToolSelection = null;
    };

    this.viewerHasSelection = function() {
        if (this.viewer && this.viewer.getSelectionCount() > 0) {
            return true;
        }
        if (this.viewerSelector && this.viewerSelector.selectedNodeId !== -1) {
            return true;
        }
        if (this.pinToolSelection) {
            return true;
        }
        return false;
    };

    /**
     * Cancells current framed tool through code.
     * @private
     */
    this.cancelFramedTools = function() {

        if (!this.framedToolActive) {
            return;
        }
        switch (this.framedToolActive.tool) {
            case this.markups:
                this.markups.cancelEditMode && this.markups.cancelEditMode();
                break;
            case this.pinTool:
                this.pinTool.cancelEditMode && this.pinTool.cancelEditMode();
                // TODO: Remove when its safe (start)
                this.pinTool.enablePinTool && this.pinTool.enablePinTool(false);
                // TODO: Remove when its safe (start)
                this.pinToolSelection = null;
                break;
            case this.viewerSelector:
                this.viewerSelector.cancelEditMode && this.viewerSelector.cancelEditMode();
                break;
        }
        this.setActiveFramedTool(null,null);
    };

    /**
     * Sets a tool as the active one.
     * Pass null to deactivate the current tool.
     * @param {Object} framedTool - Either this.pinTool, this.markups or this.viewerSelector.
     * @param {String} toolName
     */
    this.setActiveFramedTool = function(framedTool, toolName) {
        this.framedToolActive = null;

        if (framedTool && toolName) {
            this.framedToolActive = {
                tool: framedTool,
                name: toolName
            };
        }

        if (framedTool && framedTool !== this.pinTool) {
            // Make sure that when we enter a framed tool that is NOT the pin tool
            // we clear its selection cache.
            this.pinToolSelection = null;
        }
    };

    this.toggleFramedTool = function(framedToolName) {
        var framedTool = null;
        switch(framedToolName) {
            case Autodesk.Comments2.Constants.FRAMED_TOOL_OBJECT:
                framedTool = this.viewerSelector;
                break;
            case Autodesk.Comments2.Constants.FRAMED_TOOL_POINT:
                framedTool = this.pinTool;
                break;
        }

        var isToolActive = (framedTool && 'editMode' in framedTool) ? framedTool.editMode : true;
        this.cancelFramedTools();
        if (framedTool && !isToolActive)  {
            //this.clearSelectedSnapshot();
            this.setActiveFramedTool(framedTool, framedToolName);
            if (framedTool.enterEditMode){
                framedTool.enterEditMode();
            }
        }

        // return the active tool
        return this.framedToolActive ? this.framedToolActive.name : null;
    };

    /**
     *  Returns whether the model is loaded or not.
     *
     * @returns {Boolean} - Whether the model is loaded or not.
     * @private
     */
    this.isModelLoaded = function() {
        return this.viewer && this.viewer.model && this.viewer.model.isLoadDone();
    };

    /**
     * Adds a Marker associated with a comment to the viewer.
     * @param {Object} appComment
     * @private
     */
    this.addCommentMarkerToViewer = function(appComment) {

        if (!this.markers) {
            return;
        }

        if (!Autodesk.Comments2.LmvUtils.isValidNodeDbId(appComment['node-id'])) {
            return;
        }

        // not all comments have markers
        if(!appComment['marker-controller']) {
            return;
        }

        var commentNodeOffset = appComment["node-offset"];
        var commentViewerMaker = appComment['marker-controller'].getViewerDiv();

        if (appComment['marker-id'] !== null) {
            if (commentNodeOffset) {
                commentNodeOffset[0] = parseFloat(commentNodeOffset[0]);
                commentNodeOffset[1] = parseFloat(commentNodeOffset[1]);
                commentNodeOffset[2] = parseFloat(commentNodeOffset[2]);
                commentNodeOffset = new THREE.Vector3().fromArray(commentNodeOffset);
            }
            var commentNodeID = appComment["node-id"];
            if (!Autodesk.Comments2.LmvUtils.isValidNodeDbId(commentNodeID)) {
                commentNodeID = -1;
            }
            this.markers.setNodeMarker(appComment["marker-id"], commentNodeID, commentViewerMaker, commentNodeOffset);

            this.markerEventManager.addEventListener(commentViewerMaker, "click", function(event) {
                self.onViewerMarkerClick(appComment);
                event.stopPropagation();
                event.preventDefault();
            }, false);

            this.markerEventManager.addEventListener(commentViewerMaker, "mouseenter", function(event) {
                self.onViewerMarkerEnter(appComment);
                event.stopPropagation();
                event.preventDefault();
            }, false);

            this.markerEventManager.addEventListener(commentViewerMaker, "mouseleave", function(event) {
                self.onViewerMarkerLeave(appComment);
                event.stopPropagation();
                event.preventDefault();
            }, false);
        }
    };

    this.restorePinToolSelection = function() {
        if (!this.pinToolSelection) {
            return;
        }
        this.viewer.clearSelection();
        if (this.pinToolSelection.selectedNodeId === -1) {
            return;
        }
        var nodeId = this.pinToolSelection.selectedNodeId;
        Autodesk.Comments2.LmvUtils.setSelection(this.viewer, [nodeId]);
    };

    /**
     * Clears the currently selected nodes in the viewer and then selects all nodes the comment is attached too.
     * If the comment is not assigned to any nodes, highlights the entire model.
     * @param {Object} appComment Data associated with a comment.
     * @private
     */
    this.replaceSelectionWithCommentHighlights = function(appComment) {

        if (!this.viewer || !this.markers) {
            return;
        }
        if (this.viewer.model.is2d()) {
            return;
        }

        var selector = this.viewer.impl ? this.viewer.impl.selector : null;
        if (selector) {
            selector.clearSelection();
        }

        if (appComment['marker-id'] !== null) {
            var model = this.viewer.model;
            if (model) {
                var nodes = appComment["highlight-node-ids"];
                var nodesLength = nodes.length;
                for (var i = 0; i < nodesLength; ++i) {
                    this.markers.highlightNode(nodes[i]);
                }
            }
        }
    };

    /**
     * Override this method to do something when the user clicks on a viewer marker.
     * @param {Object} appComment Comment data.
     * @private
     */
    this.onViewerMarkerClick = function(appComment) {
        // Abort operation we are still animating
        if (this.getTransitionActive()) {
            return;
        }

        this.fireEvent({type:this.EVENT_COMMENTS2_CLICK_VIEWER_MARKER, data:appComment});
    };

    /**
     * Override this to do something when the user enters a comment marker.
     * @param {Object} appComment Node in the model Document.
     * @private
     */
    this.onViewerMarkerEnter = function(appComment) {
        this.fireEvent({type:this.EVENT_COMMENTS2_ENTER_VIEWER_MARKER, data:appComment});
    };

    /**
     * Override this to do something when the user leaves a viewer marker.
     * @param {Object} appComment - Data associated with a comment.
     * @private
     */
    this.onViewerMarkerLeave = function(appComment) {
        this.fireEvent({type:this.EVENT_COMMENTS2_LEAVE_VIEWER_MARKER, data:appComment});
    };
};

Autodesk.Comments2.CommentsViewer.prototype.constructor = Autodesk.Comments2.CommentsViewer;
namespaceFunction('Autodesk.Comments2.Utils');

/**
 * Wrapper function for window.btoa() which is unsupported in IE9
 *
 * @param {String} bPhrase - 'binary' (unicode) string which will be converted to ascii-byte string
 *                          (each character within 0-255 value range).
 * @returns {String}
 */
Autodesk.Comments2.Utils.encodePhrase = function(bPhrase) {
    if (window.btoa) {
        return window.btoa(bPhrase);
    }
    // IE9 support
    return window.Base64.encode(bPhrase);
};

/**
 * Wrapper function for window.atob() which is unsupported in IE9
 *
 * @param {String} aPhrase - ascii-encoded string (each character within 0-255 value range) that
 *                          needs conversion into a 'binary' string (unicode support).
 * @returns {String}
 */
Autodesk.Comments2.Utils.decodePhrase = function(aPhrase) {
    if (window.atob) {
        return window.atob(aPhrase);
    }
    // IE9 support
    return window.Base64.decode(aPhrase);
};

/**
 * Checks whether an object is empty (i.e: {}) or not.
 * @param {Object} sampleObject
 * @returns {boolean}
 */
Autodesk.Comments2.Utils.isEmptyObject = function(sampleObject) {
    var key;
    for (key in sampleObject) {
        return false;
    }
    return true;
};

/**
 * Wraps any links in HTMLText in anchor tags. It ignores any links that are already inside html nodes.
 * @param {string} htmlText
 * @returns {string} Original text with the links inserted.
 * @private
 */
Autodesk.Comments2.linkify = function(htmlText) {

    // This is the jQuery RegExp
    // Source https://github.com/SoapBox/jQuery-linkify/blob/master/src/linkified.js
    var urlRegex = new RegExp([
        "(", '\\s|[^a-zA-Z0-9.\\+_\\/"\\>\\-]|^', ")(?:", "(",
        "[a-zA-Z0-9\\+_\\-]+", "(?:", "\\.[a-zA-Z0-9\\+_\\-]+",
        ")*@", ")?(", "http:\\/\\/|https:\\/\\/|ftp:\\/\\/",
        ")?(", "(?:(?:[a-z0-9][a-z0-9_%\\-_+]*\\.)+)", ")(",
        "(?:com|ca|co|edu|gov|net|org|dev|biz|cat|int|pro|tel|mil",
        "|aero|asia|coop|info|jobs|mobi|museum|name|post|travel|local|[a-z]{2})",
        ")(", "(?::\\d{1,5})", ")?(", "(?:", "[\\/|\\?]", "(?:",
        "[\\-a-zA-Z0-9_%#*&+=~!?,;:.\\/]*", ")*", ")", "[\\-\\/a-zA-Z0-9_%#*&+=~]",
        "|", "\\/?", ")?", ")(", '[^a-zA-Z0-9\\+_\\/"\\<\\-]|$', ")"
    ].join(""), "g");
    var emailRegex = /(.+)@(.+){2,}\.(.+){2,}/;
    var containsProtocol = /\b(ftp|http|https)/;

    var node = document.createElement('div');
    node.innerHTML = htmlText;

    var wrapURL = function(url) {
        url = url.trim();

        if(emailRegex.test(url)) {
            return ' <a href="mailto:' + url +'">' + url + '</a>';
        }
        else {
            var prefix = containsProtocol.test(url) ? "" : "//";
            return ' <a href="' + prefix + url + '" target="_blank">' + url + '</a>';
        }
    };

    return Autodesk.Comments2.decodeText(htmlText, urlRegex, wrapURL);
};

/**
 * Searches HTML for a regex pattern and then replaces the matched text
 * @param {HTML} htmlText - the html To replace
 * @param {RegExp} regex
 * @param {function} replaceFunction - a function that returns the replaced text
 * @returns {string}
 */
Autodesk.Comments2.decodeText = function(htmlText, regex, replaceFunction) {
    var result = [];
    var node = document.createElement('div');
    node.innerHTML = htmlText;

    var getOuterHTML = function(node) {
        if ("outerHTML" in node) {
            return node.outerHTML;
        }
        else {
            var parentDiv = document.createElement('div');
            parentDiv.appendChild(node.cloneNode(true));
            return parentDiv.innerHTML;
        }
    };

    for (node=node.firstChild;node;node=node.nextSibling){
        if (node.nodeType === 3) { // 3 == TEXT_NODE
            result.push(node.textContent.replace(regex, replaceFunction));
        }
        else {
            result.push(getOuterHTML(node));
        }
    }
    return result.join('');
};

/**
 * Returns if a feature is enabled based on the settings provided
 * @param {Object} settings
 * @param {String} feature
 * @returns {boolean}
 */
Autodesk.Comments2.featureEnabled = function(settings, feature) {
    if(settings && settings.features) {
        return settings.features.indexOf(feature) > -1;
    }
    return false;
};

Autodesk.Comments2.svgNodeToString = function(domNode){

    var result = '';
    try {
        var xmlSerializer = new XMLSerializer();
        result = xmlSerializer.serializeToString(domNode);
    } catch (err) {
        result = '';
        console.warn('svgNodeToString failed to generate string representation of domNode.');
    }
    return result;
};

Autodesk.Comments2.stringToSvgNode = function(stringNode){

    var node = null;
    try {
        var domParser = new DOMParser();
        var doc = domParser.parseFromString(stringNode, "text/xml");
        node = doc.firstChild; // We should only be getting 1 child anyway.
    } catch (err) {
        node = null;
        console.warn('stringToSvgNode failed to generate an HTMLElement from its string representation.');
    }
    return node;
};

Autodesk.Comments2.generateGuid = function() {
    // http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

/**
 *
 * @param {Object} viewer - The Viewer3D instance (or a Viewer3DGui)
 * @param {Function} callback - Function callback, no args
 */
Autodesk.Comments2.notifyNavigationComplete = function(viewer, callback) {

    function checkTransitionComplete() {
        if (!viewer.navigation.getTransitionActive()) {

            // Notify 1 frame LATER!
            requestAnimationFrame(function(){
                callback();
            });
            return;
        }

        requestAnimationFrame(checkTransitionComplete);
    }

    // Skip first frame
    requestAnimationFrame(checkTransitionComplete);
};

/**
 *
 * @param {ArrayBuffer|String} ossData - Image Capture data contained in an OSS bucket. Can be either
 *                                       a base64 string or a binary png file.
 * @returns {String} Image Capture represented as a String that can be used in an Image html tag.
 */
Autodesk.Comments2.ossAttachmentToImageDataString = function(ossData) {

    // Binary data for Image Capture generated by Fusion AND by
    // Commenting Service when resizing Image Capture attachments submitted
    if (ossData instanceof ArrayBuffer) {
        var blobType = {type : 'image/png'};
        var blob = new Blob( [ossData], blobType );
        return window.URL.createObjectURL( blob );
    }

    // All other cases assume it's a string with proper encoding
    // Comments 2.0 Web UI (this project) generates String representations of the image (non-binary)
    return ossData;
};

/**
 * Source: http://stackoverflow.com/questions/20691320/save-captured-png-as-arraybuffer
 * @param {String} base64string - "data:image/png;base64,iVBORw0..."
 */
Autodesk.Comments2.base64StringImageToArrayBuffer = function(base64string) {

    // TODO: Revisit the usage of this function //

    // Removes prefix
    base64string = base64string.replace(/^data:image\/(png|jpg);base64,/, "");

    var binaryString = Autodesk.Comments2.Utils.decodePhrase(base64string);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer; // returns an ArrayBuffer
};

Autodesk.Comments2.isParentOf = function(element, potentialParent) {
    var current = element;
    while (current) {
        if(current === potentialParent) {
            return true;
        }
        current = current.parentNode;
    }
    return false;
};

/**
 * Re-implementation of Array.reduce() which is save from Array.reduce() overrides.
 * This is specially useful when running in A360 environment.
 *
 * Notice that as opposed to Array.reduce, the initValue is passed BEFORE the
 * reduce function.
 *
 * @param {Array} theArray
 * @param {*} theInitValue
 * @param {Function} theFunction
 * @returns {*|null}
 */
Autodesk.Comments2.arrayReduce = function(theArray, theInitValue, theFunction) {

    // In an idea world, we should call
    //
    //      return theArray.reduce(theFunction, theInitValue);
    //
    // and be done here.  Unfortunately, in A360, due to a 3rd party lib being
    // used, Object.reduce is being overridden, which messes up Array.reduce.
    // Thus, we re-implement this function in here.

    // TODO: Reconsider using native Array.reduce whenever possible.

    var accumulator = theInitValue;
    for (var i= 0, len=theArray.length; i<len; ++i) {
        accumulator = theFunction(accumulator, theArray[i]);
    }
    return accumulator;
};

Autodesk.Comments2.getObjectSetElementWithIdType = function(objectSet, idType) {

    if (!objectSet || !Array.isArray(objectSet)) {
        return null;
    }

    for (var i= 0, len=objectSet.length; i<len; ++i) {
        if (objectSet[i].idType === idType) {
            return objectSet[i];
        }
    }
    return null;
};

namespaceFunction('Autodesk.Comment');

/**
 * An EventManager class used to handle cleanup or event listeners.
 * @constructor
 * @private
 */
Autodesk.Comment.EventManager = function() {
    this.listeners = [];
};

/**
 * Adds an event listener to be handled by the EventManager.
 * @param {HTMLElement} target
 * @param {string} type
 * @param {Function} handler
 * @param {Boolean} useCapture
 * @private
 */
Autodesk.Comment.EventManager.prototype.addEventListener = function(target, type, handler, useCapture) {
    target.addEventListener(type, handler, useCapture);
    this.listeners.push({
        target: target,
        type: type,
        handler: handler,
        useCapture: useCapture
    });
};

/**
 * Checks to see if the eventManager already has an Event Listener.
 * @param {HTMLElement} target
 * @param {string} type
 * @param {Function} handler - optional, if provided checks for a match, otherwise stops at type
 * @private
 */
Autodesk.Comment.EventManager.prototype.hasEventListener = function(target, type, handler) {
    return this.getListenerIndex(target, type, handler) > -1;
};

/**
 * Checks to see if the eventManager already has an Event Listener.
 * @param {HTMLElement} target
 * @param {string} type
 * @param {Function} handler - optional, if provided checks for a match, otherwise stops at type
 * @private
 */
Autodesk.Comment.EventManager.prototype.getListenerIndex = function(target, type, handler) {
    for(var i = 0, len = this.listeners.length; i < len; ++i) {
        var listenerData = this.listeners[i];
        if(target === listenerData.target) {
            if(type === listenerData.type) {
                if(handler) {
                    if(listenerData.handler === handler) {
                        return i;
                    }
                }
                else {
                    return i;
                }
            }
        }
    }
    return -1;
};

/**
 * Removes all listeners from a target.
 * @param {HTMLElement} target
 * @private
 */
Autodesk.Comment.EventManager.prototype.removeTargetsListeners = function(target) {
    for(var i = this.listeners.length-1; i >= 0; --i) {
        var listener = this.listeners[i];
        if(listener.target == target) {
            target.removeEventListener(listener.type, listener.handler, listener.useCapture);
        }
        this.listeners.splice(i, 1);
    }
};

/**
 * Removes an event listener
 * @param {HTMLElement} target
 * @param {string} type
 * @param {Function} handler - optional, if provided checks for a match, otherwise stops at type
 * @private
 */
Autodesk.Comment.EventManager.prototype.removeEventListener = function(target, type, handler) {
    var index = this.getListenerIndex(target, type, handler);
    if (index === -1) {
        return;
    }

    var listener = this.listeners[index];
    target.removeEventListener(listener.type, listener.handler, listener.useCapture);
    this.listeners.splice(index, 1);
};

Autodesk.Comment.EventManager.prototype.removeAllListeners = function() {
    for(var i = 0, len = this.listeners.length; i < len; ++i) {
        var data = this.listeners[i];
        data['target'].removeEventListener(data['type'], data['handler'], data['useCapture']);
    }
    this.listeners = [];
};

/**
 * Removes all event listeners added through the EventManger.
 * @private
 */
Autodesk.Comment.EventManager.prototype.destroy = function() {
    this.removeAllListeners();
    this.listeners = null;
};

Autodesk.Comment.EventManager.prototype.constructor = Autodesk.Comment.EventManager;
// Begin closure
(function() {

    // IMPORTANT: Screen Capture can only be perform "one-at-a-time" //

    var CAPTURE_STATE_NONE = 0,
        CAPTURE_STATE_START = 1,
        CAPTURE_STATE_LMV = 2,
        CAPTURE_STATE_MARKERS = 3,
        CAPTURE_STATE_ANNOTATIONS = 4,
        CAPTURE_STATE_DONE = 5;


    var mCanvas, mContext,      // Our own canvas used to generate the Image Capture PNG
        mViewer,
        mMarkersExt, mAnnotExt,     // References to LMV instance and ViewerAnnotations extension
        mViewerScreenshot,      // Helper Image instance
        mCaptureState = CAPTURE_STATE_NONE,
        mUserCallback;          // User provided function to notify when Captured Image is ready for consumption.

    /**
     * Captures an image of the viewer and all markups over it.
     *
     * @param {Object} viewer - LMV viewer instance
     * @param {Object} markersExt - Markers Extension. Can be null to not include markers graphics.
     * @param {Object} annotExt - Annotations Extension. Can be null to not include annotation graphics.
     * @param {Function} callback - Has the screenCapture base64 encoded image string as its parameter
     */
    Autodesk.Comments2.screenCapture = function(viewer, markersExt, annotExt, callback) {

        if (!viewer || mCaptureState !== CAPTURE_STATE_NONE) {
            callback();
            return;
        }

        mViewer = viewer;
        mMarkersExt = markersExt;
        mAnnotExt = annotExt;
        mUserCallback = callback;
        mCaptureState = CAPTURE_STATE_START;
        mCanvas = document.createElement("canvas");
        mContext = mCanvas.getContext('2d');

        var viewerBounds = viewer.container.getBoundingClientRect();
        mCanvas.width = (viewerBounds.right - viewerBounds.left);
        mCanvas.height = (viewerBounds.bottom - viewerBounds.top);

        mViewerScreenshot = new Image();
        mViewerScreenshot.onload = onCheckNextCaptureState;
        mViewerScreenshot.src = viewer.getScreenShot(0,0); // Get the full image
    };

    //////////////////////
    // Helper functions //
    //////////////////////

    function onCheckNextCaptureState() {
        mCaptureState++;
        switch (mCaptureState) {

            case CAPTURE_STATE_LMV:
                captureStateLmv();
                break;

            case CAPTURE_STATE_MARKERS:
                captureStateMarkers();
                break;

            case CAPTURE_STATE_ANNOTATIONS:
                captureStateAnnotations();
                break;

            case CAPTURE_STATE_DONE:
                finalizeProcess();
                break;
        }
    }

    function finalizeProcess() {
        var callback = mUserCallback;
        var output = mCanvas.toDataURL("image/png");
        var outputW = mCanvas.width;
        var outputH = mCanvas.height;
        mCaptureState = CAPTURE_STATE_NONE;
        mViewer = mCanvas = mContext = null;
        mUserCallback = null;
        // Notify caller
        callback(output, outputW, outputH);
    }

    function captureStateLmv() {
        mContext.drawImage(mViewerScreenshot, 0, 0, mCanvas.width, mCanvas.height);
        onCheckNextCaptureState();
    }

    function captureStateMarkers() {
        if (mMarkersExt) {
            drawMarkersCanvas(onCheckNextCaptureState);
        } else {
            onCheckNextCaptureState();
        }
    }

    function captureStateAnnotations() {

        // TODO: Fix safari security error.
        if (mAnnotExt) {
            drawAnnotationsCanvas(onCheckNextCaptureState);
        } else {
            onCheckNextCaptureState();
        }
    }

    function drawMarkersCanvas(onStepComplete) {
        var drawCanvasImage = function (event) {
            var loadedImg = event.target;
            mContext.drawImage(loadedImg, 0, 0);

            onStepComplete && onStepComplete();
        };
        var source = new Image();
        source.onload = drawCanvasImage;
        source.src = mMarkersExt.markerLines.toDataURL("image/png");
    }

    function drawAnnotationsCanvas(onStepComplete) {

        // Generates html with all annotations.
        var svgHtml = Autodesk.Comments2.svgNodeToString(mAnnotExt.divDrawAnnotations);

        // Generates svg uri file with svg html.
        var svgWidth = mCanvas.width;
        var svgHeight = mCanvas.height;

        var svgBounds = 'width="' + svgWidth + 'px" height="' + svgHeight + 'px"';
        var svgViewBox = 'viewbox="0 0 ' + svgWidth + ' ' + svgHeight + '"';

        var data =
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" ' + svgBounds + ' ' + svgViewBox + '>' +
            '<foreignObject width="100%" height="100%">' +
                '<div xmlns="http://www.w3.org/1999/xhtml" style="width:100%; height:100%; position:absolute;top:0;display:block">' +
                    svgHtml +
                '</div>' +
            '</foreignObject>' +
            '</svg>';

        var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
        var svg = doctype + data;
        var uri = 'data:image/svg+xml;utf8,' + svg;

        // Create image and compose it when loaded.
        var img = new Image();
        img.onload = function () {
            mContext.drawImage(img, 0, 0, svgWidth, svgHeight);
            onStepComplete();
        };

        img.onerror = function() {
            onStepComplete();
        };
        img.src = uri;
    }
    
// End closure
})();

namespaceFunction('Autodesk.Comments2.LmvUtils');

Autodesk.Comments2.LmvUtils.getFragmentId = function(model, dbId) {

    if (!model) {
        return -1;
    }

    var modelData = model.getData();
    if (!modelData.instanceTree) {
        return dbId; // Yup, LMV takes them as the same.
    }

    var fragId2dbId = modelData.fragments.fragId2dbId;
    var fragId2dbIdCount = fragId2dbId.length;
    for (var i = 0; i < fragId2dbIdCount; ++i) {
        if (fragId2dbId[i] == dbId) {
            return i;
        }
    }
    return -1;
};

Autodesk.Comments2.LmvUtils.getNodeId = function(fragmentId, viewer) {

    if (fragmentId == -1) {
        return -1;
    }

    var modelData = viewer.model.getData();
    var id = fragmentId;
    if (modelData.instanceTree) {
        var fragmentToId = modelData.fragments.fragId2dbId;
        id = fragmentToId[fragmentId];
    }

    // In 2d node ids are objects and we will not link the point to any node 2d case.
    // Check if id is a number, jquery style.
    if (!isNaN(parseFloat(id)) && isFinite(id)) {
        return id;
    }

    return -1;
};

// TODO: We should not be using a function like this.
// The concept of "nodes" is deprecated in LMV version 1.0.889+
Autodesk.Comments2.LmvUtils.getNodesByIds = function(model, nodeIds) {
    var modelData = model.getData();
    if (modelData.instanceTree) {
        return model.getNodesByIds(nodeIds);
    }
    // We fake it. Viewer does the same.
    return nodeIds.map(function(nodeId) {
        return { dbId: nodeId, fragIds: nodeId };
    });
};

Autodesk.Comments2.LmvUtils.setSelection = function(viewer, dbIds) {
    viewer.select(dbIds);
};


Autodesk.Comments2.LmvUtils.isValidNodeDbId = function(dbId) {

    // node-id can actually be '0', so we must check for null and undefined here
    // A value of 0 for the node id is very rare, only happens when the 3d model
    // has no instanceTree data, and we are targeting the 1rs fragment (which has
    // id 0). Thus, it's virtual node has an dbId of 0 as well.
    // Further note: In all other cases, dbIds are 1-based.
    return (dbId !== null) && (dbId !== undefined);
};


/**
 *
 * @param {Object} viewport - { eye: Object, target: Object, pivot: Object }
 * @param {Object} [offset] - { x: Number, y: Number , y: Number }
 */
Autodesk.Comments2.LmvUtils.applyOffsetToCamera = function(viewport, offset) {

    if(!viewport || !offset) {
        return;
    }

    if ('eye' in viewport) {
        viewport['eye'][0] =  (Number(viewport['eye'][0]) + offset.x).toString();
        viewport['eye'][1] =  (Number(viewport['eye'][1]) + offset.y).toString();
        viewport['eye'][2] =  (Number(viewport['eye'][2]) + offset.z).toString();
    }

    if ('target' in viewport) {
        viewport['target'][0] = (Number(viewport['target'][0]) + offset.x).toString();
        viewport['target'][1] = (Number(viewport['target'][1]) + offset.y).toString();
        viewport['target'][2] = (Number(viewport['target'][2]) + offset.z).toString();
    }

    if ('pivotPoint' in viewport) {
        viewport['pivotPoint'][0] =  (Number(viewport['pivotPoint'][0]) + offset.x).toString();
        viewport['pivotPoint'][1] =  (Number(viewport['pivotPoint'][1]) + offset.y).toString();
        viewport['pivotPoint'][2] =  (Number(viewport['pivotPoint'][2]) + offset.z).toString();
    }
};


namespaceFunction('Autodesk.Comment');

/**
 * Marker UI constructor.
 * @constructor
 * @param {int} uiId - Incremental Number used for display purposes (1, 2, 3, etc).
 * @param {HTMLElement} panelMarker Another div to be shown in the commentsPanel.
 * @private
 */
Autodesk.Comment.Marker = function(uiId, direction, panelMarker)
{
    this.uiId = uiId;
    this.lastDirection = "";
    direction = direction || "";

    if (panelMarker) {
        this.commentPanelSymbolDiv = panelMarker;
        this.commentPanelSymbolDiv.innerHTML = this.uiId;
    }

    this.viewerDiv = this.createViewerMarkerDiv();
    this.lastArrowClassName = null;
    this.setDirection(direction);
    this.setActive(false);

    // if the id is in the teens, offset the text or resize it for longer text
    this.centerMarkerText();
};

/**
 * Helper method that creates a div structure for the viewer AND comment panel markers.
 * @param {int} markerType Appends a css class to the holder and symbol to modify its appearance.
 * @returns {HTMLElement} Div structure.
 * @private
 */
Autodesk.Comment.Marker.prototype.createViewerMarkerDiv = function() {

    var holderDiv = document.createElement("div");
    holderDiv.className = "comment-marker-holder";

    // This is currently required by the ViewerMarkers extension.
    // TODO: The only reason it is required is because we are calling setDirection here.
    // We can probably avoid calling setDirection, and then remove reference to .data.
    holderDiv.data = this;

    var arrowDiv = document.createElement("div");
    arrowDiv.className = "comment-marker-arrow";

    var symbolDiv = document.createElement("div");
    symbolDiv.className = "comment-marker-symbol";
    symbolDiv.innerHTML = this.uiId;

    this.arrowDiv = arrowDiv;
    this.viewerSymbolDiv = symbolDiv;

    holderDiv.appendChild(arrowDiv);
    holderDiv.appendChild(symbolDiv);
    return holderDiv;
};

/**
 * Changes the UiId that gets rendered inside the viewer and panel marker.
 * @param {number} uiId New id to display.
 * @private
 */
Autodesk.Comment.Marker.prototype.setUiId = function(uiId) {

    this.uiId = uiId;
    this.viewerSymbolDiv.innerHTML = uiId;

    if (this.commentPanelSymbolDiv) {
        this.commentPanelSymbolDiv.innerHTML = uiId;
    }

    // if the id is in the teens, offset the text or resize it for longer text
    this.centerMarkerText();
};

/**
 * Sets the direction of the marker. Updates the css class used for the direction.
 * @param {string} direction Direction the marker's arrow is pointing.
 * @private
 */
Autodesk.Comment.Marker.prototype.setDirection = function(direction) {
    if (this.lastDirection == direction) {
        return;
    }

    if (this.lastArrowClassName) {
        this.arrowDiv.classList.remove(this.lastArrowClassName);
        this.lastArrowClassName = null;
    }

    if (direction == "") {
        return;
    }

    var arrowClass;
    switch(direction) {
        case "left":
            arrowClass = "comment-marker-left";
            break;
        case "right":
            arrowClass = "comment-marker-right";
            break;
        case "outside_left":
            arrowClass = "comment-marker-outside-left";
            break;
        case "outside_right":
            arrowClass = "comment-marker-outside-right";
            break;
        case "outside_top":
            arrowClass = "comment-marker-outside-top";
            break;
        case "outside_bottom":
            arrowClass = "comment-marker-outside-bottom";
            break;
    }
    this.arrowDiv.classList.add(arrowClass);

    this.lastArrowClassName = arrowClass;
    this.lastDirection = direction;
};

/**
 * Gets the div that's been added to the CommentPanel.
 * @return {HTMLElement} div
 */
Autodesk.Comment.Marker.prototype.getCommentPanelDiv = function(div) {
    return this.commentPanelSymbolDiv;
};

/**
 * Sets the div that's been added to the CommentPanel. This is used to update that div when changes are made to the
 * ViewerMaker.
 * @param {HTMLElement} div
 */
Autodesk.Comment.Marker.prototype.setCommentPanelDiv = function(div) {
    this.commentPanelSymbolDiv = div;
    this.commentPanelSymbolDiv.innerHTML = this.uiId;

    this.centerMarkerText();
};

/**
 * Gets the div that needs to be added to the Viewer.
 * @returns {HTMLElement}
 */
Autodesk.Comment.Marker.prototype.getViewerDiv = function() {
    return this.viewerDiv;
};

/**
 * Signals that the comment associated with this marker is the current active one.
 * @returns {HTMLElement}
 */
Autodesk.Comment.Marker.prototype.setActive = function(isActive) {
    if(isActive) {
        this.viewerSymbolDiv.classList.add("active");
        if(this.commentPanelSymbolDiv) {
            this.commentPanelSymbolDiv.classList.add("active");
        }
    } else {
        this.viewerSymbolDiv.classList.remove("active");
        if(this.commentPanelSymbolDiv) {
            this.commentPanelSymbolDiv.classList.remove("active");
        }
    }
};

/**
 * Centers the id inside the comment marker symbols
 * @private
 */
Autodesk.Comment.Marker.prototype.centerMarkerText = function() {
    var lastTextClass = this.textClass;
    this.textClass = null;

    var id = this.uiId;
    if(id >= 10 && id < 20 && id != 11) {
        this.textClass = "offset-text";
    }
    else if (id >= 1000) {
        this.textClass = "thousands";
    }
    else if (id >= 100) {
        this.textClass = "hundreds";
    }

    if(lastTextClass) {
        this.viewerSymbolDiv.classList.remove(lastTextClass);
    }
    if(this.textClass) {
        this.viewerSymbolDiv.classList.add(this.textClass);
    }

    if (this.commentPanelSymbolDiv) {
        if(lastTextClass) {
            this.commentPanelSymbolDiv.classList.remove(lastTextClass);
        }
        if(this.textClass) {
            this.commentPanelSymbolDiv.classList.add(this.textClass);
        }
    }
};

Autodesk.Comment.Marker.prototype.constructor = Autodesk.Comment.Marker;
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.MarkupsActionBar = function(args) {

    var settings = args.settings;
    var LOC_TABLE = Autodesk.Comments2.Localization;

        // Events
    this.EVENT_COMMENTS2_ACTIONBAR_SAVE = 'EVENT_COMMENTS2_ACTIONBAR_SAVE';
    this.EVENT_COMMENTS2_ACTIONBAR_ENTER_ANNOTATIONS_EDIT_MODE = 'EVENT_COMMENTS2_ACTIONBAR_ENTER_ANNOTATIONS_EDIT_MODE';
    this.EVENT_COMMENTS2_ACTIONBAR_CANCEL_ANNOTATIONS_EDIT_MODE = 'EVENT_COMMENTS2_ACTIONBAR_CANCEL_ANNOTATIONS_EDIT_MODE';
    this.EVENT_COMMENTS2_ACTIONBAR_LEAVE_ANNOTATIONS_VIEW_MODE = 'EVENT_COMMENTS2_ACTIONBAR_LEAVE_ANNOTATIONS_VIEW_MODE';

        // States
    var STATE_DISABLED = 'disabled',
        STATE_NONE = 'none',
        STATE_IDLE = 'idle',
        STATE_EDIT = 'edit',
        STATE_VIEW = 'view',
        STATE_TOOL = 'tool'; // other tool like pin tool.

    var mState = STATE_NONE,
        mEventMgr = new Autodesk.Comment.EventManager();

        // Dom related
    var mDivIdle,
        mDivEdit,
        mDivView;

    var mViewMarkupLabel;

        // Set Traits
    Autodesk.Comments2.addTrait_eventDispatcher(this);

    this.initialize = function() {
        // Nothing.
        if (!Autodesk.Comments2.featureEnabled(settings, "annotations")) {
            mState = STATE_DISABLED;
        }
    };

    this.destroy = function() {
        Autodesk.Comments2.remTrait_eventDispatcher(this);
        if (mEventMgr) {
            mEventMgr.destroy();
            mEventMgr = null;
        }
        this.removeUI();
        mState = STATE_NONE; // Not calling setState on purpose.
    };

    this.removeUI = function() {
        if (mDivIdle) {
            mDivIdle.parentNode && mDivIdle.parentNode.removeChild(mDivIdle);
            mDivIdle = null;
        }
        if (mDivEdit) {
            mDivEdit.parentNode && mDivEdit.parentNode.removeChild(mDivEdit);
            mDivEdit = null;
        }
        if (mDivView) {
            mDivView.parentNode && mDivView.parentNode.removeChild(mDivView);
            mDivView = null;
        }
    };

    this.buildUI = function(container) {

        mDivIdle = this.buildIdleUI();
        mDivEdit = this.buildEditUI();
        mDivView = this.buildViewUI();

        container.appendChild(mDivIdle);
        container.appendChild(mDivEdit);
        container.appendChild(mDivView);

        this.setState(STATE_IDLE);
    };

    this.buildIdleUI = function() {
        var div = document.createElement('div');

        // Create Markup //
        var btn = document.createElement('button');
        btn.className = 'MarkupsActionBarButton MABButton_Create';
        btn.innerHTML = LOC_TABLE.matbar_create_markup;
        mEventMgr.addEventListener(btn, 'click', function () {
            this.setState(STATE_EDIT);
            this.fireEvent({ type:this.EVENT_COMMENTS2_ACTIONBAR_ENTER_ANNOTATIONS_EDIT_MODE, data:{} });
            // Make sure the Edit div is on top of the drawing div, 'comments-edit-frame'
            mDivEdit.parentNode.appendChild(mDivEdit);
        }.bind(this));
        div.appendChild(btn);

        return div;
    };

    this.buildEditUI = function() {
        var div = document.createElement('div');
        div.className = 'MarkupActionBarPanel MABPanel_Edit';

        // Cancel //
        var btn = document.createElement('button');
        btn.className = 'MarkupsActionBarButton MABButton_Edit_Cancel';
        btn.innerHTML = LOC_TABLE.matbar_mode_edit_cancel;
        mEventMgr.addEventListener(btn, 'click', function () {
            this.setState(STATE_IDLE);
            this.fireEvent({ type:this.EVENT_COMMENTS2_ACTIONBAR_CANCEL_ANNOTATIONS_EDIT_MODE, data:{} });
        }.bind(this));
        div.appendChild(btn);

        // Label //
        btn = document.createElement('button');
        btn.className = 'MABLabel_Edit_Info';
        btn.innerHTML = LOC_TABLE.matbar_mode_edit_info;
        div.appendChild(btn);

        // Finish //
        btn = document.createElement('button');
        btn.className = 'MarkupsActionBarButton MABButton_Edit_Finish';
        btn.innerHTML = LOC_TABLE.matbar_mode_edit_done;
        mEventMgr.addEventListener(btn, 'click', function () {
            this.setState(STATE_IDLE);
            this.fireEvent({ type: this.EVENT_COMMENTS2_ACTIONBAR_SAVE });
        }.bind(this));
        div.appendChild(btn);

        return div;
    };

    this.buildViewUI = function() {
        var div = document.createElement('div');
        div.className = 'MarkupActionBarPanel MABPanel_View';

        // Label //
        btn = document.createElement('button');
        btn.className = 'MABLabel_View_Info';
        btn.innerHTML = '';
        div.appendChild(btn);
        mViewMarkupLabel = btn;

        // Finish //
        var btn = document.createElement('button');
        btn.className = 'MarkupsActionBarButton MABButton_View_Finish';
        btn.innerHTML = LOC_TABLE.matbar_mode_view_done;
        mEventMgr.addEventListener(btn, 'click', function () {
            this.setState(STATE_IDLE);
            this.fireEvent({ type: this.EVENT_COMMENTS2_ACTIONBAR_LEAVE_ANNOTATIONS_VIEW_MODE, data:{} });
        }.bind(this));
        div.appendChild(btn);

        return div;
    };

    this.setState = function(newState) {

        if (newState === mState || mState === STATE_DISABLED) {
            return;
        }

        mState = newState;

        mDivIdle.style.display = (mState === STATE_IDLE) ? 'block' : 'none';
        mDivEdit.style.display = (mState === STATE_EDIT) ? 'block' : 'none';
        mDivView.style.display = (mState === STATE_VIEW) ? 'block' : 'none';
    };

    this.enterViewMode = function(appAttachment) {
        this.setState(STATE_VIEW);
        if (mViewMarkupLabel) {
            mViewMarkupLabel.innerHTML = appAttachment ? appAttachment.label
                : LOC_TABLE.matbar_mode_view_loading;
        }
    };

    this.enterToolFrame = function() {
        this.setState(STATE_TOOL);
    };

    this.leaveToolFrame = function() {
        this.setState(STATE_IDLE);
    };

    this.setViewer = function(viewer) {

        if (mState === STATE_DISABLED) {
            return;
        }

        this.removeUI();
        mState = STATE_NONE;

        var container = viewer.container;
        this.buildUI(container);
    };

    this.escapeCreateMarkups = function() {
        this.setState(STATE_IDLE);
    };

};

Autodesk.Comments2.MarkupsActionBar.prototype.constructor = Autodesk.Comments2.MarkupsActionBar;

namespaceFunction('Autodesk.Comment');

/**
 * A MessageOverlay class used to display messages, alerts, and confirm boxes from the CommentPanel.
 * @param {HTMLElement} parentContainer Element to add the message overlay to
 * @param zIndex Z index of this overlay.
 * @constructor
 * @private
 */
Autodesk.Comment.MessageOverlay = function (parentContainer, zIndex, locStrings) {
    var self = this;
    var openedType;

    this.MESSAGE = "message";
    this.CONFIRM = "confirm";
    this.zIndex = zIndex || "99999999";

    var messageContainer = document.createElement("div");
    messageContainer.className = "comment-message-container";

    var topSection = document.createElement("div");
    topSection.className = "comment-message-top";

    var closeButton = document.createElement("input");
    closeButton.type = "submit";
    closeButton.className = "commentPanel-imageButton comment-message-button-close";
    topSection.appendChild(closeButton);

    var messageTitle = document.createElement("div");
    messageTitle.className = "comment-message-title";
    topSection.appendChild(messageTitle);

    var messageBody = document.createElement("div");
    messageBody.className = "comment-message-body";

    var messageButtons = document.createElement("div");
    messageButtons.className = "comment-message-buttons";

    var blocker = document.createElement("div");
    blocker.className = "content-blocker";

    messageContainer.appendChild(topSection);
    messageContainer.appendChild(messageBody);
    messageContainer.appendChild(messageButtons);

    var onSuccess;
    var onCancel;
    /**
     * Shows the Overlay.
     * @param {string} Type of display.  As of now has support for confirm boxes and adding links.
     * @param {string} title Title of the message.
     * @param {string} text additional text for the message.
     * @param {Function} callbackSuccess Callback for hitting the ok button.
     * @param {Function} callbackCancel Callback for hitting the cancel button.
     * @private
     */
    this.open = function(type, title, text, callbackSuccess, callbackCancel) {
        title = title || "";
        messageTitle.innerHTML = title;

        text = text || "";

        self.clearType();
        onSuccess = callbackSuccess;
        onCancel = callbackCancel;

        if (openedType === type) {
            return;
        }
        openedType = type;

        // Set the new type.
        switch(openedType) {
            case self.MESSAGE:
                messageBody.innerHTML = text;
                break;
            case self.CONFIRM:
                messageBody.innerHTML = text;
                messageContainer.style.width = "480px";
                messageContainer.style.height = "152px";
                break;
        }

        messageContainer.style.zIndex = this.zIndex;

        if(openedType !== self.MESSAGE) {
            messageButtons.appendChild(cancelButton);
            cancelButton.addEventListener("click", self.onCancelClick);
            messageButtons.appendChild(okButton);
            okButton.addEventListener("click", self.onOkClick);
        }
        closeButton.addEventListener("click", self.onCancelClick);

        parentContainer.appendChild(blocker);
        parentContainer.appendChild(messageContainer);
    };

    this.onOkClick = function(event) {
        var returnData;

        self.close();
        if (typeof onSuccess === "function") {
            onSuccess(returnData);
        }
    };

    this.onCancelClick = function(event) {
        self.close();
        if (typeof onCancel === "function") {
            onCancel();
        }
    };

    this.close = function() {
        this.clearType();

        parentContainer.removeChild(blocker);
        parentContainer.removeChild(messageContainer);
    };

    this.clearType = function() {

        if(openedType !== self.MESSAGE) {
            okButton.removeEventListener("click", self.onOkClick);
            cancelButton.removeEventListener("click", self.onCancelClick);
        }
        closeButton.removeEventListener("click", self.onCancelClick);

        openedType = null;
        messageBody.innerHTML = "";
    };

    this.destroy = function() {
        if(openedType) {
            this.close();
        }
    };

    this.createButton = function(text, additionalClass) {
        if(additionalClass) {
            additionalClass = " " + additionalClass;
        } else {
            additionalClass = "";
        }

        var button = document.createElement('input');
        button.type = 'submit';
        button.value = text;
        button.className = 'comment-message-button' + additionalClass;
        button.setAttribute("data-i18n", "[value]" + text );

        return button;
    };

    // Define different content types.
    // General buttons.
    var okButton = this.createButton(locStrings['button_delete'], "comment-message-confirm-button");
    var cancelButton = this.createButton(locStrings['button_cancel'], "comment-message-cancel-button");
};
namespaceFunction('Autodesk.Comments2');

/**
 * @class
 * @param {Object} args
 * @param {Object} args.settings
 * @constructor
 */
Autodesk.Comments2.ServerOperator = function (args) {

        // arguments
    var settings = args.settings;

        // Events
    this.EVENT_COMMENTS2_SERVER_REQUEST_SUCCESS = "EVENT_COMMENTS2_SERVER_REQUEST_SUCCESS";
    this.EVENT_COMMENTS2_SERVER_REQUEST_FAILURE = "EVENT_COMMENTS2_SERVER_REQUEST_FAILURE";
    this.EVENT_COMMENTS2_SERVER_POST_SUCCESS = "EVENT_COMMENTS2_SERVER_POST_SUCCESS";
    this.EVENT_COMMENTS2_SERVER_POST_REPLY_FAILURE = "EVENT_COMMENTS2_SERVER_POST_REPLY_FAILURE";
    this.EVENT_COMMENTS2_SERVER_POST_REPLY_SUCCESS = "EVENT_COMMENTS2_SERVER_POST_REPLY_SUCCESS";
    this.EVENT_COMMENTS2_SERVER_POST_FAILURE = "EVENT_COMMENTS2_SERVER_POST_FAILURE";
    this.EVENT_COMMENTS2_SERVER_DELETE_SUCCESS = "EVENT_COMMENTS2_SERVER_DELETE_SUCCESS";
    this.EVENT_COMMENTS2_SERVER_DELETE_FAILURE = "EVENT_COMMENTS2_SERVER_DELETE_FAILURE";
    this.EVENT_COMMENTS2_SERVER_DELETE_REPLY_SUCCESS = "EVENT_COMMENTS2_SERVER_DELETE_REPLY_SUCCESS";
    this.EVENT_COMMENTS2_SERVER_DELETE_REPLY_FAILURE = "EVENT_COMMENTS2_SERVER_DELETE_REPLY_FAILURE";
    this.EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_SUCCESS = "EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_SUCCESS";
    this.EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_FAILURE = "EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_FAILURE";
    this.EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_SUCCESS = "EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_SUCCESS";
    this.EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_FAILURE = "EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_FAILURE";
    this.EVENT_COMMENTS2_SERVER_FETCH_LOCATION_OSS_FAILURE = "EVENT_COMMENTS2_SERVER_FETCH_LOCATION_OSS_FAILURE";

        // members
    this.commentService = new Autodesk.Comment.CommentService(settings);
    this.pendingOps = {};
    this.nextPendingOpId = 0;

    Autodesk.Comments2.addTrait_eventDispatcher(this);

    this.destroy = function() {
        this.commentService = null;
        Autodesk.Comments2.remTrait_eventDispatcher(this);
    };

    /**
     * Initialization.
     *
     * @param {String} pathStorage
     */
    this.initialize = function(pathStorage) {
        this.commentService = new Autodesk.Comment.CommentService(settings);
        this.commentService.PATH_STORAGE = pathStorage;

        if (settings.oauth2token !== undefined) {
            this.setToken(settings.oauth2token);
        }
    };

    /**
     * Updates the token.
     * @param {String} token - 3-legged OAuth2 token
     */
    this.setToken = function(token) {
        this.commentService.CREDENTIALS.OAUTH_2_TOKEN = token;
    };

    /**
     * Tracks a new server operation.
     *
     * @param {Object} appComment - Comment associated with the server op.
     * @param {String} opName - For debugging, which operation is it (post, delete)
     * @returns {number} ServerOp Id
     */
    this.pushPendingOp = function(appComment, opName) {

        var opId = this.nextPendingOpId++;
        this.pendingOps[opId] = {
            id: opId,
            name: opName,
            appComment: appComment
        };
        return opId;
    };

    this.setParentChildOps = function(parentOpId, childOpId) {

        // add children to parent
        var parentData = this.pendingOps[parentOpId];
        if (parentData.childrenCount === undefined) {
            parentData.childrenCount = 1;
        } else {
            parentData.childrenCount++; // Don't really need to keep track of which ops are our children
        }
        if (!parentData.responses) {
            parentData.responses = [];
        }

        // set parent to child
        var childData = this.pendingOps[childOpId];
        childData.parent = parentOpId;
    };

    /**
     * Fetches comments from server.
     */
    this.requestComments = function() {

        var that = this;
        var requestPromise;
        if (settings.customListComments) {
            requestPromise = settings.customListComments();
        } else {
            requestPromise = this.commentService.listComments();
        }

        requestPromise.then(function(response) {
            // Resolve Promise //
            var comments = Array.isArray(response) ? response : JSON.parse(response);
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_REQUEST_SUCCESS, data: comments });
        })
        ['catch'](function() {
            // Reject Promise //
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_REQUEST_FAILURE });
        });
    };

    /**
     * Sends a post comment operation to the server.
     *
     * @param {Object} appComment - Comment to delete
     */
    this.postComment = function(appComment) {

        var that = this;
        var xhrHeaders = [];
        if (settings.useAcm) {
            xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.NAMESPACE);
            xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.POLICIES);
        }

        var requestPromise;
        if (settings.customPostComment) {
            // Here we send appComment (because it's an external hook)
            requestPromise = settings.customPostComment(appComment, xhrHeaders);
        } else {
            // Here we send dbComment (because it's an internal hook)
            requestPromise = this.commentService.postComment(appComment.dbComment, xhrHeaders)
        }

        requestPromise.then(function(response) {
            // Resolve Promise //
            // The response for a posted comment is the comment
            appComment['dbComment'] = typeof(response) === 'string' ? JSON.parse(response) : response;
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_POST_SUCCESS, data: appComment });
        })
        ['catch'](function() {
            that.fireEvent({ type:that.EVENT_COMMENTS2_SERVER_POST_FAILURE, data:appComment });
        });

    };

    /**
     * Sends a post comment operation to the server.
     *
     * @param {Object} appCommentReply - Comment to delete
     */
    this.postCommentReply = function(appCommentReply) {

        var that = this;
        var requestPromise;
        if (settings.customPostCommentReply) {
            // Here we send appCommentReply (because it's an external hook)
            requestPromise = settings.customPostCommentReply(
                appCommentReply,
                appCommentReply.parent.dbComment.id);
        } else {
            // Here we send dbComment (because it's an internal hook)
            requestPromise = this.commentService.postCommentReply(
                appCommentReply.dbComment,
                appCommentReply.parent.dbComment.id);
        }

        requestPromise.then(function(response) {
            // Resolve Promise //
            // The response for a posted comment is the comment
            appCommentReply['dbComment'] = typeof(response) === 'string' ? JSON.parse(response) : response;
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_POST_REPLY_SUCCESS, data: appCommentReply });
        })
        ['catch'](function() {
            // Reject Promise //
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_POST_REPLY_FAILURE, data:appCommentReply });
        });
    };

    /**
     * Deletes a comment from commenting service.
     * @param {Object} appComment - Comment to delete.
     */
    this.deleteComment = function(appComment) {

        var that = this;
        var requestPromise;
        if (settings.customDeleteComment) {
            requestPromise = settings.customDeleteComment(appComment.dbComment.id);
        } else {
            requestPromise = this.commentService.deleteComment(appComment.dbComment.id);
        }

        requestPromise.then(function() {
            // Resolve Promise //
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_DELETE_SUCCESS, data:appComment } );
        })
        ['catch'](function() {
            // Reject Promise //
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_DELETE_FAILURE, data:appComment } );
        });
    };

    /**
     * Deletes a comment reply from commenting service.
     * @param {Object} appCommentReply - Comment to delete.
     * @param {Object} appCommentParent - Parent Comment
     */
    this.deleteCommentReply = function(appCommentReply, appCommentParent) {

        var that = this;
        var requestPromise;
        if (settings.customDeleteCommentReply) {
            requestPromise = settings.customDeleteCommentReply(
                appCommentParent.dbComment.id,
                appCommentReply.dbComment.id
            );
        } else {
            // Yeah, here we re-use deleteComment
            requestPromise = this.commentService.deleteComment(
                appCommentReply.dbComment.id
            );
        }

        requestPromise.then(function() {
            // Resolve Promise //
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_DELETE_REPLY_SUCCESS, data:appCommentReply } );
        })
        ['catch'](function() {
            // Reject Promise //
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_DELETE_REPLY_FAILURE, data:appCommentReply } );
        });
    };

    /**
     * Uploads a bunch of attachments that will get associated to the appComment.
     *
     * @param {Object} appComment
     * @param {Array} attachmentList - Array containing { name: String, data: String }
     */
    this.uploadOssAttachments = function(appComment, attachmentList) {

        if (attachmentList.length === 0) {
            return;
        }

        // First need to ask commenting service for the location where uploads should go
        var opId = this.pushPendingOp(appComment, 'multiple_getOssPaths:' + attachmentList.length);
        attachmentList.forEach(function(appAttachment) {
            this.fetchLocationForNewOssAttachment(appAttachment, opId);
        }.bind(this));
    };

    this.fetchLocationForNewOssAttachment = function(appAttachment, parentOpId) {

        var that = this;
        var opId = this.pushPendingOp(appAttachment, 'single_attachment');

        var xhrHeaders = [];
        if (appAttachment.type === Autodesk.Comments2.Constants.ATTACHMENT_TYPE_SNAPSHOT) {
            xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.FORMAT_PNG); // Required for backend thumbnail generation
        } else if (appAttachment.type === Autodesk.Comments2.Constants.ATTACHMENT_TYPE_MARKUP) {
            xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.FORMAT_SVG); // Not really needed.
        }
        if (settings.useAcm) {
            xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.NAMESPACE);
            xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.POLICIES);
        }

        this.setParentChildOps(parentOpId, opId);

        this.commentService.fetchLocationForNewOssAttachment(xhrHeaders, {
            onLoad: function(event) {
                var xhr = event.currentTarget;
                if (xhr.status == 200) {
                    that.onFetchLocationForNewOssAttachmentSuccess(opId, xhr.responseText);
                }
                else {
                    that.onFetchLocationForNewOssAttachmentFailure(opId);
                }
            },
            onError: function() {
                that.onFetchLocationForNewOssAttachmentFailure(opId);
            },
            onTimeout: function() {
                that.onFetchLocationForNewOssAttachmentFailure(opId);
            }
        });
    };

    this.onFetchLocationForNewOssAttachmentSuccess = function(opId, responseText) {

        var pendingOp = this.pendingOps[opId];
        if (!pendingOp) {
            // Callback to an already resolved opId.
            return;
        }

        // Remove
        delete this.pendingOps[opId];

        // Get aggregated operation
        var parentOpId = pendingOp.parent;
        var parentOpData = this.pendingOps[parentOpId];

        parentOpData.childrenCount -= 1;
        parentOpData.responses.push({
            appAttachment: pendingOp.appComment,
            responseObject: JSON.parse(responseText)
        });

        if (parentOpData.childrenCount === 0) {

            // remove pending op from map
            delete this.pendingOps[parentOpId];

            // Successfully fetched ids for all attachments that need to be posted to OSS
            // We now need to upload the attachments!
            this.uploadOssAttachmentsStep2(parentOpData.appComment, parentOpData.responses);
        }
    };

    this.onFetchLocationForNewOssAttachmentFailure = function(opId) {

        var pendingOp = this.pendingOps[opId];
        if (!pendingOp) {
            // Callback to an already resolved opId.
            return;
        }

        // Remove
        delete this.pendingOps[opId];

        // Get aggregated operation
        var parentOpId = pendingOp.parent;
        var parentOpData = this.pendingOps[parentOpId];
        var appComment = parentOpData.appComment;

        this.fireEvent({ type: this.EVENT_COMMENTS2_SERVER_FETCH_LOCATION_OSS_FAILURE, data: appComment });
    };

    /**
     * Uploads a bunch of attachments that will get associated to the appComment.
     *
     * @param {Object} appComment
     * @param {Array} appAttachmentAndServerResponses - Array containing { appAttachment: Object,
     *                                                                     responseObject: Object }
     */
    this.uploadOssAttachmentsStep2 = function(appComment, appAttachmentAndServerResponses) {

         var opId = this.pushPendingOp(appComment, 'multiple_attachments:' + appAttachmentAndServerResponses.length);
        appAttachmentAndServerResponses.forEach(function(fetchOssAttachmentData) {

            // Patch appAttachment ids with those obtained from the commenting service
            var ossUrn = fetchOssAttachmentData.responseObject.attachment[0].url;
            var dataParts = this.commentService.extractOssBucketAndId(ossUrn); // Returns array with 2 elements
                                                                               // [ <bucket_id>, <attachment_id> ]

            var bucketId = dataParts[0];
            var attachmentId = dataParts[1];

            var appAttachment = fetchOssAttachmentData.appAttachment;
            appAttachment.id = attachmentId;
            appAttachment.ossUrn = ossUrn;
            this.uploadOssAttachmentAux(appAttachment, bucketId, opId);
         }.bind(this));
    };

    /**
     * Saves a screenCapture to OSS as an attachment
     * @param {Object} appAttachment
     * @param {String} bucketId - OS id of the bucket where the attachment will be posted to.
     * @param {number} parentOpId - id of the operation that this upload is part of.
     *                              All file uploads are part of a grouped operation.
     * @private
     */
    this.uploadOssAttachmentAux = function(appAttachment, bucketId, parentOpId) {

        var that = this;
        var opId = this.pushPendingOp(appAttachment, 'single_attachment');

        var attachmentId = appAttachment.id;
        var attachmentData = appAttachment.data;
        this.setParentChildOps(parentOpId, opId);

        // Only send Namespace (avoid sending Policy, not supported nor needed)
        var xhrHeaders = [];
        if (settings.useAcm) {
            xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.NAMESPACE);
        }

        this.commentService.postAttachment(attachmentId, attachmentData, bucketId, xhrHeaders, {
            onLoad: function(event) {
                var xhr = event.currentTarget;
                if (xhr.status == 200) {
                    that.onUploadAttachmentSuccess(opId, xhr.responseText);
                }
                else {
                    that.onUploadAttachmentFailure(opId);
                }
            },
            onError: function() {
                that.onUploadAttachmentFailure(opId);
            },
            onTimeout: function() {
                that.onUploadAttachmentFailure(opId);
            }
        });
    };

    /**
     * Callback for when the comment was successfully updated on the server
     * @param {Number} opId - Id of the operation
     * @param {String} responseText - the result from uploading the attachment
     */
    this.onUploadAttachmentSuccess = function(opId, responseText) {

        var pendingOp = this.pendingOps[opId];
        if (!pendingOp) {
            // Callback to an already resolved opId.
            return;
        }

        // Remove
        delete this.pendingOps[opId];

        // Get aggregated operation
        var parentOpId = pendingOp.parent;
        var parentOpData = this.pendingOps[parentOpId];

        parentOpData.childrenCount -= 1;
        parentOpData.responses.push({
            appAttachment: pendingOp.appComment,
            responseObject: JSON.parse(responseText)
        });

        if (parentOpData.childrenCount === 0) {

            // remove pending op from map
            delete this.pendingOps[parentOpId];

            // All attachments have been posted successfully! //
            var eventData = {
                appComment: parentOpData.appComment,
                responses: parentOpData.responses
            };
            this.fireEvent({ type: this.EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_SUCCESS, data:eventData });
        }
    };

    /**
     * Callback for when the comments failed to be updated from the server.
     * @param {Number} opId - Id of the operation
     */
    this.onUploadAttachmentFailure = function(opId) {

        var pendingOp = this.pendingOps[opId];
        if (!pendingOp) {
            // Callback to an already resolved opId.
            return;
        }

        // remove pending op from map
        delete this.pendingOps[opId];
        var appComment = pendingOp.appComment;

        this.fireEvent({ type: this.EVENT_COMMENTS2_SERVER_UPLOAD_ATTACHMENT_FAILURE, data:appComment } );
    };

    /**
     *
     * @param {Object} context
     * @param {String} ossPathUrn
     * @param {String} ossDataType - Value from Autodesk.Comments2.Constants.ATTACHMENT_DATA_TYPE_XXXXXXXX
     */
    this.getAttachment = function(context, ossPathUrn, ossDataType) {

        var that = this;
        var requestPromise;
        if (settings.customGetOssAttachment) {
            requestPromise = settings.customGetOssAttachment(ossPathUrn);
        } else {
            // Only send Namespace (avoid sending Policy, not supported nor needed)
            var xhrHeaders = [];
            if (settings.useAcm) {
                xhrHeaders.push(Autodesk.Comments2.Constants.XHR_HEADER.NAMESPACE);
            }
            requestPromise = this.commentService.getAttachment(ossPathUrn, ossDataType, xhrHeaders);
        }

        requestPromise.then(function(response) {
            var eventData = {
                context: context,
                responseText: response
            };
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_SUCCESS, data:eventData });
        })
        ['catch'](function() {
            that.fireEvent({ type: that.EVENT_COMMENTS2_SERVER_GET_ATTACHMENT_FAILURE, data:context } );
        });
    };

};
namespaceFunction('Autodesk.Comments2');

/**
 * Injects functions and members to a client object which will
 * receive the ability to dispatch events.
 * Mechanism is the same as in Autodesk.Viewing.Viewer.
 *
 * Note: All of the code here comes from Autodesk.Viewing.Viewer
 *
 * @param {Object} client - Object that will become an event dispatcher.
 */
Autodesk.Comments2.addTrait_eventDispatcher = function (client) {

    // Inject member variable
    client.listeners = {};

    // Inject functions
    client.addEventListener = function(type, listener) {
        if (typeof this.listeners[type] == "undefined"){
            this.listeners[type] = [];
        }
        this.listeners[type].push(listener);
    };
    client.hasEventListener = function (type, listener) {
        if (this.listeners === undefined) return false;
        var listeners = this.listeners;
        if (listeners[ type ] !== undefined && listeners[ type ].indexOf(listener) !== -1) {
            return true;
        }
        return false;
    };
    client.removeEventListener = function(type, listener) {
        if (this.listeners[type] instanceof Array){
            var li = this.listeners[type];
            for (var i=0, len=li.length; i < len; i++){
                if (li[i] === listener){
                    li.splice(i, 1);
                    break;
                }
            }
        }
    };
    client.fireEvent = function(event) {
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }

        if (!event.type){
            throw new Error("event type unknown.");
        }

        if (this.listeners[event.type] instanceof Array) {
            var typeListeners = this.listeners[event.type].slice();
            for (var i=0; i < typeListeners.length; i++) {
                typeListeners[i].call(this, event);
            }
        }
    };

};

/**
 * Removes the EventDispatcher trait
 *
 * @param {Object} client
 */
Autodesk.Comments2.remTrait_eventDispatcher = function (client) {
    try {
        delete client.listeners;
        delete client.addEventListener;
        delete client.hasEventListener;
        delete client.removeEventListener;
        delete client.fireEvent;
    } catch (e) {
        // nothing
    }
};
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsRectangle = function() {

    /**
     *
     * @param viewer
     * @returns {Autodesk.Comments2.AnnotationArrow}
     * @constructor
     */
    Autodesk.Comments2.AnnotationRectangle = function(id, viewer, strokeWidth, color) {

        Autodesk.Comments2.Annotation.call(this, id, viewer);

        this.type = Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW;
        this.constraintHeight = true;

        // Create head and tail.
        this.head = new THREE.Vector3();
        this.tail = new THREE.Vector3();

        this.color = color;

        this.guiPropsId = "RectangleProps";
        this.strokeWidth = strokeWidth;
        this.div = this.createSVG(strokeWidth);

        // Sets creation state.
        this.selected = false;
        this.div.children[0].classList.add("comments-annotation-arrow-creation");

        return this;
    };

    Autodesk.Comments2.AnnotationRectangle.prototype = Object.create(Autodesk.Comments2.Annotation.prototype);
    Autodesk.Comments2.AnnotationRectangle.prototype.constructor = Autodesk.Comments2.AnnotationRectangle;

    Autodesk.Comments2.AnnotationRectangle.MIN_ARROWS_WITDH = 50;

    Autodesk.Comments2.AnnotationRectangle.prototype.createSVG = function(strokeWidth) {

        this.clientStrokeWidth = Autodesk.Comments2.getClientStrokeWidth(strokeWidth, this.viewer);
        strokeWidth = this.clientStrokeWidth;

        // Create arrow head polygon.
        var arrowSide = strokeWidth * 2;

        var t0x = 0;
        var t0y = strokeWidth;

        var t1x = t0x + Math.cos(30 * (Math.PI / 180)) * arrowSide;
        var t1y = t0y + Math.sin(30 * (Math.PI / 180)) * arrowSide;

        var t2x = t1x;
        var t2y = t0y - Math.sin(30 * (Math.PI / 180)) * arrowSide;

        var t3x = t0x;
        var t3y = t0y;

        var polygon = "'" + t1x + "," + t1y + " " + t2x + "," + t2y + " " + t3x + "," + t3y + "'";

        var div = document.createElement('div');
        div.style.top = "0";
        div.style.left = "0";
        div.style.position = 'absolute';
        div.setAttribute("xmlns", document.documentElement.namespaceURI);
        div.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="' + arrowSide + 'px" tabindex="0" style="position:absolute;left:0;top:0;display:inline-block">' +
            '<polygon xmlns="http://www.w3.org/2000/svg" version="1.1" points=' + polygon + ' style="fill:' + this.color + ';" />' +
            '<line xmlns="http://www.w3.org/2000/svg" version="1.1" x1="' + strokeWidth + '" y1="' + strokeWidth + '" x2="85" y2="' + strokeWidth + '" style="stroke:' + this.color + ';stroke-width:' + strokeWidth + ';" />' +
            '</svg>';
        div.addEventListener("click", function(event) { event.stopPropagation(); }.bind(this), true );
        div.addEventListener("mousedown", this.onMouseDown.bind(this), true );
        div.addEventListener("keydown", this.onKeyDown.bind(this), true );

        div.children[0].classList.add("comments-annotation-arrow");
        this.height = arrowSide;

        div.children[0].addEventListener("mouseout", function(){this.hightlight(false);}.bind(this));
        div.children[0].addEventListener("mouseover", function(){this.hightlight(true);}.bind(this));

        return div;
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.set = function(xO, yO, xF, yF) {

        var v1 = new THREE.Vector2(-xF + xO, -yF + yO).normalize();
        var v2 = new THREE.Vector2(1, 0);

        this.angle = Math.acos(v1.dot(v2)) * (v1.y > v2.y ? 1 : -1);

        var aw = Math.sqrt(Math.pow(xF - xO, 2) + Math.pow(yF - yO, 2));
        aw = Math.max( Autodesk.Comments2.AnnotationArrow.MIN_ARROWS_WITDH, aw );

        var head = this.head;
        var tail = this.tail;

        head.set(xO, yO, 0);
        tail.set(xF, yF, 0);

        var direction = tail.clone().sub(head).normalize();
        tail.set(xO + direction.x * aw, yO + direction.y * aw, 0);

        var ox = aw;
        var oy = this.height * 0.5;

        var m1 = new THREE.Matrix4().makeTranslation(-ox, -oy, 0);
        var m2 = new THREE.Matrix4().makeRotationZ(this.angle);
        var m3 = new THREE.Matrix4().makeTranslation(xO, yO, 0);
        var ma = m3.multiply(m2).multiply(m1);
        this.transform = ma;

        this.length = aw;
        this.updateStyle(this.transform, this.color);
        var svg = this.div.children[0];
        Autodesk.Comments2.getSVGChild(svg, 1).setAttribute('x2', aw);

        this.head3dPosition = Autodesk.Comments2.clientToWorld(head.x, head.y, 0, this.viewer);
        this.tail3dPosition = Autodesk.Comments2.clientToWorld(tail.x, tail.y, 0, this.viewer);

        this.clientPosition.x = tail.x + (head.x - tail.x) * 0.5;
        this.clientPosition.y = tail.y + (head.y - tail.y) * 0.5;

        this.clientWidth = Math.round(this.head.clone().sub(this.tail).length());
        this.clientHeight = Math.round(this.clientStrokeWidth * 2);
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.rescale = function() {

        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        var length = head.clone().sub(tail).length();
        var scale = length / this.length;

        var ox = this.length * scale;
        var oy = this.height * 0.5 * scale;

        var m0 = new THREE.Matrix4().makeScale(scale, scale, 1);
        var m1 = new THREE.Matrix4().makeTranslation(-ox, -oy, 0);
        var m2 = new THREE.Matrix4().makeRotationZ(this.angle);
        var m3 = new THREE.Matrix4().makeTranslation(head.x, head.y, 0);
        var ma = m3.multiply(m2).multiply(m1).multiply(m0);
        this.transform = ma;

        this.updateStyle(this.transform, this.color);
        var svg = this.div.children[0];
        Autodesk.Comments2.getSVGChild(svg, 1).setAttribute('x2', this.length);

        // Force svg redraw.
        var parent = this.div.parentNode;
        parent.removeChild(this.div);
        parent.appendChild(this.div);

        this.head.copy(head);
        this.tail.copy(tail);

        this.clientPosition.x = tail.x + (head.x - tail.x) * 0.5;
        this.clientPosition.y = tail.y + (head.y - tail.y) * 0.5;

        this.clientWidth = Math.round(this.head.clone().sub(this.tail).length());
        this.clientHeight = Math.round(this.clientStrokeWidth * 2);
    };

    /**
     *
     * @param transform
     * @param {String} color
     */
    Autodesk.Comments2.AnnotationRectangle.prototype.updateStyle = function(transform, color) {

        var me = transform.elements;
        var ma = ['matrix(', me[0], ',', me[1], ',', me[4], ',', me[5], ',', me[12], ',', me[13], ')'].join('');

        var svg = this.div.children[0];
        var svgPolygon = Autodesk.Comments2.getSVGChild(svg, 0);
        var svgLine = Autodesk.Comments2.getSVGChild(svg, 1);

        var transform =
            'transform:' + ma + '; transform-origin: 0 0;' +
            '-ms-transform:' + ma + '; -ms-transform-origin: 0 0;' +
            '-webkit-transform: ' + ma + '; -webkit-transform-origin: 0 0;' +
            '-moz-transform: ' + ma + '; -moz-transform-origin: 0 0;' +
            '-o-transform: ' + ma + ';-o-transform-origin: 0 0;';

        svg.setAttribute("style", 'width:' + this.length + 'px; ' + transform + ' position:absolute; display:block');
        svgPolygon.setAttribute("style", 'fill:' + color + ';');
        svgLine.setAttribute("style", 'stroke:' + color + '; stroke-width:' + this.clientStrokeWidth + ';');
    };

    /**
     *
     * @param parent
     */
    Autodesk.Comments2.AnnotationRectangle.prototype.setParent = function(parent) {

        var div = this.div;

        div.parentNode && div.parentNode.removeChild(div);
        parent && parent.appendChild(div);
    };

    /**
     *
     * @param x
     * @param y
     */
    Autodesk.Comments2.AnnotationRectangle.prototype.setClientPosition = function(x,y) {

        var viewer = this.viewer;
        var clientPosition = this.clientPosition;

        clientPosition.x = x;
        clientPosition.y = y;

        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, viewer);

        var dx = head.x - tail.x;
        var dy = head.y - tail.y;

        var xo = x - dx * 0.5;
        var yo = y - dy * 0.5;

        this.tail3dPosition = Autodesk.Comments2.clientToWorld(xo, yo, 0, viewer);
        this.head3dPosition = Autodesk.Comments2.clientToWorld(xo + dx, yo + dy, 0, viewer);

        this.rescale();
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.setStrokeWidth = function(width) {

        this.strokeWidth = width;

        // Remove previous arrow and create a new one, append it to the same parent as the old arrow.
        var parent = this.div.parentNode;
        this.setParent(null);
        this.div = this.createSVG(width);
        this.setParent(parent);

        // Force selected state to recently created divs.
        if (this.selected) {
            this.selected = false;
            this.select();
        }

        // Restore arrow lenght and position.
        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        this.set(head.x, head.y, tail.x, tail.y);
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.setColor = function(color) {
        this.color = color;
        this.updateStyle(this.transform, color);
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.created = function() {

        this.div.children[0].classList.remove("comments-annotation-arrow-creation");

        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        this.length = head.clone().sub(tail).length();
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.destroy = function() {

        this.unselect();
        this.setParent(null);
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.initFromMetadata = function (metadata) {

        this.readMetadata(metadata);
        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);
        this.setStrokeWidth(this.strokeWidth);
        this.set(head.x, head.y, tail.x, tail.y);
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.select = function() {

        if (this.selected) {
            return;
        }
        this.selected = true;
        Autodesk.Comments2.Annotation.prototype.select.call(this);
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.unselect = function() {

        if (!this.selected) {
            return;
        }

        this.selected = false;
        this.div.children[0].blur();

        Autodesk.Comments2.AnnotationRectangle.prototype.unselect.call(this);
    };

    /**
     *
     * @param highlight
     */
    Autodesk.Comments2.AnnotationRectangle.prototype.hightlight = function(highlight) {

        var color = highlight ? 'yellow' : this.color;
        this.updateStyle(this.transform, color);
    };

    /**
     *
     * @param bounds
     */
    Autodesk.Comments2.AnnotationRectangle.prototype.constrainsToBounds = function(bounds) {

        // Create arrow bounding box.
        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        var arrowWidth = Math.ceil(head.clone().sub(tail).length()+1);
        var arrowHeight = this.height;

        var bboxPoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(arrowWidth, 0, 0),
            new THREE.Vector3(arrowWidth,arrowHeight, 0),
            new THREE.Vector3(0, arrowHeight, 0)
        ];

        // Transform bounding box to client space.
        var bboxPointsCount = bboxPoints.length;
        for(var i = 0; i < bboxPointsCount; ++i) {
            bboxPoints[i].applyMatrix4(this.transform);
        }

        // Calculate new bounding box that fits the transformed one.
        var bboxL = Number.MAX_VALUE;
        var bboxT = Number.MAX_VALUE;
        var bboxR = Number.MIN_VALUE;
        var bboxB = Number.MIN_VALUE;

        for(var i = 0; i < bboxPointsCount; ++i) {

            var point = bboxPoints[i];

            bboxL = Math.min(bboxL, point.x);
            bboxT = Math.min(bboxT, point.y);
            bboxR = Math.max(bboxR, point.x);
            bboxB = Math.max(bboxB, point.y);
        }

        // Calculate how much the arrow has to move to fit in working area.
        var dx = 0;
        var dy = 0;

        var x = Math.max(bounds.x, bboxL);
        var y = Math.max(bounds.y, bboxT);

        if (x != bboxL) {
            dx = x - bboxL;
        } else {
            x = Math.min(bounds.x + bounds.width , bboxR);
            dx = x - bboxR;
        }

        if (y != bboxT) {
            dy = y - bboxT;
        } else {
            y = Math.min(bounds.y + bounds.height, bboxB);
            dy = y - bboxB
        }

        // Constrain position if needed.
        if (dx != 0 || dy != 0) {
            var position = this.getClientPosition();
            this.setClientPosition(position.x + Math.round(dx), position.y + Math.round(dy));
        }
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.saveMetadata = function() {

        function toString(vector) {
            return "x=" + vector.x + ",y=" + vector.y + ",z=" + vector.z;
        }

        var metadata = [
            "type:", Autodesk.Comments2.Annotation.getTypeString(this.type),
            "; head:", toString(this.head3dPosition),
            "; tail:", toString(this.tail3dPosition),
            "; strokeWidth:", this.strokeWidth.toString(),
            "; length:", this.length.toString()
        ].join('');

        this.div.setAttribute('metadata', metadata);
    };

    Autodesk.Comments2.AnnotationRectangle.prototype.readMetadata = function(metadata) {

        function toVector(string) {
            var values = string.split(",");
            return new THREE.Vector3(
                Number.parseFloat(values[0].split("=")[1]),
                Number.parseFloat(values[1].split("=")[1]),
                Number.parseFloat(values[2].split("=")[1]));
        }

        metadata = metadata.split(';');

        // NOTE: metadata[0] contains type information (already initialized by constructor)
        this.head3dPosition = toVector(metadata[1].split(":")[1]);
        this.tail3dPosition = toVector(metadata[2].split(":")[1]);
        this.strokeWidth = Number.parseFloat(metadata[3].split(":")[1]);
        this.length = Number.parseFloat(metadata[4].split(":")[1]);
    };
};

Autodesk.Comments2.importAnnotationsEditFrame = function() {

    (function () {
        //Start closure

        'use strict';

        /**
         * A component to handle the selection of annotations.
         *
         *
         *      Sample
         *
         *      var containingDiv = document.getElementById('containingDiv3d-app-wrapper');
         *      var selectionComponent = new EditFrame(containingDiv);
         *      selectionComponent.setSelection(100, 100, 300, 150, 0);
         *
         * @param {HTMLElement} containingDiv The container where the selection layer will live.
         * @constructor
         */
        Autodesk.Comments2.EditFrame = function (containingDiv, editTool) {
            this.containingDiv = containingDiv;
            this.editTool = editTool;
            this.selectionLayer = createSelectionLayer();

            this.selection = {
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                rotation: 0,
                element: null,
                active: false,
                dragging: false,
                resizing: false,
                //a dictionary of all the drag points
                //the key for each drag point will be its cardinal/ordinal direction
                handle: {}
            };
            createSelectorBox.bind(this)();
            handleSelectionBoxDragging.bind(this)();
            handleSelectionBoxResizing.bind(this)();
            handleSelectionDoubleClick.bind(this)();

            //add the selection into the container given to us
            this.containingDiv.appendChild(this.selectionLayer);
        };


        /**
         * Draws a selection box with the given attributes
         *
         * @param {Autodesk.Comments2.Annotation} annotation - the annotation that should appear as selected
         * @param {number} x - The x coordinate to place the selection box
         * @param {number} y - The y coordinate to place the selection box
         * @param {number} width - The width of the selection box
         * @param {number} height - The height of the selection box
         * @param {number} rotation - The amount of degrees to rotate the selection box
         */
        Autodesk.Comments2.EditFrame.prototype.setSelection = function (x, y, width, height, rotation) {
            updateSelectorBoxDimensions.bind(this)(width, height);
            updateSelectorBoxPosition.bind(this)(x, y, rotation);
            updateSelectionBoxState.bind(this)(true); //activate the selection box
            this.selectionLayer.style.visibility = 'visible';
        };

        /**
         * Displays the selection box based on the position, dimension, and rotation of a given annotation
         *
         * @param {Autodesk.Comments2.Annotation} annotation - the annotation that should appear as selected
         */
        Autodesk.Comments2.EditFrame.prototype.setAnnotation = function (annotation) {

            if (!annotation) {
                updateSelectionBoxState.bind(this)(false);
                return;
            }

            var width = annotation.getClientWidth(),
                height = annotation.getClientHeight(),
                position = annotation.getClientPosition(),

            // TODO: Use only getRotation when arrow returns the correct value.
                rotation = annotation.angle ? annotation.angle * (180 / Math.PI) : annotation.getRotation();

            var previousAnnotation = this.annotation;
            this.annotation = annotation;
            this.setSelection(position.x - (width / 2), position.y - (height / 2), width, height, rotation);

            this.enableResizeHandles();

            //since the selection element is already over the currently selected annotation
            //ignore the following for repeat calls with the same annotation
            if (previousAnnotation === annotation) return;

            //check that the element where the mouse was last seen
            //is actually the selection element and not the redo button

            //get the offset of our parent container and add the relative mouse position
            //to calculate pageX ang pageY
            var containerBBox = this.containingDiv.getBoundingClientRect();
            var pageX = containerBBox.left + this.editTool.canvasX, 
                pageY = containerBBox.top + this.editTool.canvasY;

            if (document.elementFromPoint(pageX, pageY) !== this.selection.element) return;

            //NOTE: the following only applies when an annotation is selected for the first time

            //when an annotation is first selected, the edit frame has to change its 
            //position so it displays over the annotation. Since the edit frame is not
            //over the annotation, we cannot capture the initial mousedown event. Therefore, to reposition
            //the annotation, the user has to select the annotation, lift their mouse, and perform 
            //a mousedown after the edit frame is in place.
            //To get around this we raise a synthetic mousedown event so dragging will work as 
            //soon as the annotation is selected. We get the position of the mouse from the editTool
            //and pass it as an additional parameter to the mousedown event
            this._onRepositionMouseDown(null, { x: this.editTool.canvasX, y: this.editTool.canvasY });

            
        };


        Autodesk.Comments2.EditFrame.prototype.isDragging = function () {
            return this.selection.dragging;
        };

        Autodesk.Comments2.EditFrame.prototype.isResizing = function () {
            return this.selection.resizing;
        };

        Autodesk.Comments2.EditFrame.prototype.onMouseMove = function (event) {
            //dummy fn
        };

        Autodesk.Comments2.EditFrame.prototype.onMouseUp = function (event) {
            //dummy fn
        };

        Autodesk.Comments2.EditFrame.prototype.enableResizeHandles = function () {
            var annotation = this.annotation;
            if (annotation.isHeightConstrained() || annotation.isWidthConstrained()) {
                //hide all the handles
                for (var direction in this.selection.handle) {
                    this.selection.handle[direction].style.display = 'none';
                }

                //show only the resize points that are allowed
                if (annotation.isHeightConstrained()) {
                    this.selection.handle['w'].style.display = 'block';
                    this.selection.handle['e'].style.display = 'block';
                }
                if (annotation.isWidthConstrained()) {
                    this.selection.handle['n'].style.display = 'block';
                    this.selection.handle['s'].style.display = 'block';
                }
            } else {
                //no constraints, show all resize handles
                for (var direction in this.selection.handle) {
                    this.selection.handle[direction].style.display = 'block';
                }
            }
        }


        /**
         * Utility to create the CSS translate3d value from a given 2d point
         *
         * @param {number} x - coordinate
         * @param {number} y - coordinate
         * @return {string}
         */
        function toTranslate3d(x, y) {
            return 'translate3d(' + x + 'px,' + y + 'px,0)';
        }


        /**
         * Creates an element spanning the full height and width of its parent.
         * It serves as our surface to draw the selection box.
         *
         * @return {HTMLElement}
         */
        function createSelectionLayer() {
            var selectionLayer = document.createElement('div');
            selectionLayer.style.position = 'absolute';
            selectionLayer.style.top = 0;
            selectionLayer.style.bottom = 0;
            selectionLayer.style.left = 0;
            selectionLayer.style.right = 0;
            //don't let the selection box be visible outside the selection layer
            selectionLayer.style.overflow = 'hidden';
            selectionLayer.style.visibility = 'hidden';
            togglePointerEvents(selectionLayer, false);
            return selectionLayer;
        };

        /**
         * Creates a single drag point with the corresponding styles
         *
         * @param {number} diameter - The size of the drag point
         * @param {string} position - The cardinal(n, s, w, e) or ordinal(nw, nw, sw, se) direction of the point
         * @return {HTMLElement}
         */
        function createDragPoint(diameter, position) {
            var pointBorderWidth = 2;
            var point = document.createElement('div');
            point.style.position = 'absolute';
            point.style.backgroundColor = 'rgba(151, 151, 151, 1)';
            point.style.border = pointBorderWidth + 'px solid rgb(95, 98, 100)';
            point.style.height = diameter + 'px';
            point.style.width = diameter + 'px';
            point.style.borderRadius = (diameter / 2) + pointBorderWidth + 'px';
            point.style.boxSizing = 'border-box';
            setResizeCursor(point, position);
            point.classList.add('selector-drag-point', 'sdp-handle-' + position);
            point.setAttribute('data-sdp-handle', position);

            var placementOffset = -1 * ((diameter + pointBorderWidth) / 2);
            //set the position of the drag points based on the position
            switch (position) {
                case 'n':
                    //wrap the point inside a wrapper so we can center it
                    //using margin: 0 auto
                    var wrapper = document.createElement('div');
                    wrapper.style.position = 'absolute';
                    wrapper.style.width = '100%';
                    wrapper.style.height = diameter + 'px';
                    wrapper.style.top = placementOffset + 'px';
                    point.style.margin = '0 auto';
                    point.style.position = '';

                    wrapper.appendChild(point);
                    point = wrapper;

                    break;
                case 's':
                    var wrapper = document.createElement('div');
                    wrapper.style.position = 'absolute';
                    wrapper.style.width = '100%';
                    wrapper.style.height = diameter + 'px';
                    wrapper.style.bottom = placementOffset + 'px';
                    point.style.margin = '0 auto';
                    point.style.position = '';

                    wrapper.appendChild(point);
                    point = wrapper;
                    break;
                case 'w':
                    point.style.left = placementOffset + 'px';
                    point.style.top = '50%';
                    point.style.transform = 'translate3d(0, -50%, 0)';
                    break;
                case 'e':
                    point.style.right = placementOffset + 'px';
                    point.style.top = '50%';
                    point.style.transform = 'translate3d(0, -50%, 0)';
                    break;
                case 'nw':
                    point.style.top = placementOffset + 'px';
                    point.style.left = placementOffset + 'px';
                    break;
                case 'ne':
                    point.style.top = placementOffset + 'px';
                    point.style.right = placementOffset + 'px';
                    break;
                case 'sw':
                    point.style.bottom = placementOffset + 'px';
                    point.style.left = placementOffset + 'px';
                    break;
                case 'se':
                    point.style.bottom = placementOffset + 'px';
                    point.style.right = placementOffset + 'px';
                    break;
            }
            return point;
        };

        function setResizeCursor (element, direction) {
            var cursor;
            switch(direction) {
                case 'n':
                case 's':
                    cursor = 'ns-resize';
                    break;
                case 'w':
                case 'e':
                    cursor = 'ew-resize';
                    break;
                case 'ne':
                case 'sw':
                    cursor = 'nesw-resize';
                    break;
                case 'nw':
                case 'se':
                    cursor = 'nwse-resize';
                    break;
            }
            element.style.cursor = cursor;
        }

        /**
         * Creates the 8 drag points of the selection box.
         *
         * @this EditFrame
         */
        function createDragPoints(selector) {
            var pointDiameter = 12;

            ['n', 's', 'w', 'e', 'nw', 'ne', 'sw', 'se'].forEach(function (direction) {
                //store the drag point and put it in the DOM
                this.selection.handle[direction] = createDragPoint(pointDiameter, direction);
                selector.appendChild(this.selection.handle[direction]);
            }.bind(this));
        };

        /**
         * Determines if an element is a drag point
         *
         * @return {boolean}
         */
        function isDragPoint(element) {
            return element.matches('.selector-drag-point');
        }

        /**
         * Creates the element that will be used as the selection box. It also
         * takes care of adding the drag handles
         *
         * @return {HTMLElement} - the selection box
         * @this EditFrame
         */
        function createSelectorBox() {
            var borderWidth = 2;
            var borderColor = 'rgb(0, 0, 255)';
            var selectorBox = document.createElement('div');
            selectorBox.style.position = 'absolute';
            selectorBox.style.border = borderWidth + 'px dotted ' + borderColor;
            selectorBox.style.zIndex = 1;
            selectorBox.style.cursor = 'move';
            togglePointerEvents(selectorBox, true);
            selectorBox.classList.add('selector-box');
            createDragPoints.bind(this)(selectorBox);

            //store the selector box
            this.selection.element = selectorBox;

            //add the selection box to the selection layer
            this.selectionLayer.appendChild(this.selection.element);

            //position and size the selection box
            updateSelectorBoxPosition.bind(this)(this.selection.x, this.selection.y, this.selection.rotation);
            updateSelectorBoxDimensions.bind(this)(this.selection.width, this.selection.height);

            //we are just creating the box, start it out hidden
            updateSelectionBoxState.bind(this)(false);

            return selectorBox;
        };

        /**
         * Updates the display state of the selection box
         *
         * @param {boolean} active - The new state of the the selection box
         * @this EditFrame
         */
        function updateSelectionBoxState(active) {
            this.selection.active = active;
            this.selection.element.style.display = active ? 'block' : 'none';
        }

        /**
         * Updates the position and rotation of the selection box.
         *
         * @param {number} x - The x coordinate to place the selection box
         * @param {number} y - The y coordinate to place the selection box
         * @param {number} rotation - The amount of degrees to rotate the selection box
         * @this EditFrame
         */
        function updateSelectorBoxPosition(x, y, rotation) {
            this.selection.x = x;
            this.selection.y = y;
            this.selection.rotation = rotation;

            // this.selection.element.style.webkitTransform = 'rotate(' + (-1 * rotation) + 'deg)';
            // this.selection.element.style.webkitTransformOrigin = '0% 0%';
            // this.selection.element.style.webkitTransform += ' ' + toTranslate3d(x, y);
            // this.selection.element.style.transform = 'rotate(' + (-1 * rotation) + 'deg)';
            // this.selection.element.style.transformOrigin = '0% 0%';
            // this.selection.element.style.transform = toTranslate3d(x, y) + ' rotate(' + rotation + 'deg)';
            this.selection.element.style.left = x + 'px';
            this.selection.element.style.top = y + 'px';
            this.selection.element.style.transform = 'rotate(' + rotation + 'deg)';
            this.selection.element.style.transformOrigin = (this.selection.width / 2) + 'px ' + (this.selection.height / 2) + 'px';
            // this.selection.element.style.transform = toTranslate3d(x, y) + ' rotate(' + rotation + 'deg)';
        };

        /**
         * Updates the dimentions of the selection box (width and height).
         *
         * @param {number} width - The new width of the selection box
         * @param {number} height - The new height of the selection box
         * @this EditFrame
         */
        function updateSelectorBoxDimensions(width, height) {
            this.selection.width = width;
            this.selection.height = height;
            this.selection.element.style.width = width + 'px';
            this.selection.element.style.height = height + 'px';
        };


        /**
         * Attaches all the necessary listeners to handle a drag action.
         *
         * @this EditFrame
         */
        function handleSelectionBoxDragging () {
            this.selection.element.addEventListener('mousedown', this._onRepositionMouseDown.bind(this));
        };

        
        Autodesk.Comments2.EditFrame.prototype._onRepositionMouseDown = function (event, cursor) {

            //a synthetic start means that the event was triggered manually and not as a
            //result of a mousedown on the edit frame
            var syntheticStart = !(event instanceof MouseEvent);

            //during a real mousedown, ignore events originating from a resizing handle
            if (!syntheticStart && isDragPoint(event.target)) return;

            this.editTool.beginActionGroup();
            this.selection.dragging = true;
            
            //get the cursor position
            var cursor = syntheticStart ?  cursor : cursorRelativePosition(event, this.selectionLayer);

            //store the last cursor
            this.last = cursor;

            //update the function that will handle the mousemove and mouseup events
            this.onMouseMove = this._onRepositionMouseMove.bind(this);
            this.onMouseUp = this._onRepositionMouseUp.bind(this);
        };

        Autodesk.Comments2.EditFrame.prototype._onRepositionMouseMove = function (event) {
            //ignore mousemove events if the dragging state hasn't been activated
            if (!this.selection.dragging) return;

            //get the position of the cursor relative to selection layer
            var cursor = cursorRelativePosition(event, this.selectionLayer);

            //determine how many pixel we have to shift the 
            //selection box to keep the cursor on the drag point
            var movement = {
                x: this.last.x - cursor.x,
                y: this.last.y - cursor.y
            };

            this.last = cursor;

            var x = this.selection.x - movement.x;
            var y = this.selection.y - movement.y;
            updateSelectorBoxPosition.bind(this)(x, y, this.selection.rotation);


            //tell the annotation to start transforming
            //the annotation expects an (x, y) coordinate that
            //uses an origin at the center, adjust our x, y because 
            //our origin starts at the top left
            var halfWidth = this.selection.width / 2;
            var halfHeight = this.selection.height / 2;

            var position = { x: this.selection.x + halfWidth, y: this.selection.y + halfHeight };
            var setPosition = new Autodesk.Comments2.SetPosition(this.editTool, this.annotation, position);

            setPosition.execute();
        };

        Autodesk.Comments2.EditFrame.prototype._onRepositionMouseUp = function () {
            this.last = null;

            //this should never be called after the mouse up because we are no longer repositioning
            this.onMouseMove = function () {/*do nothing*/};
            this.onMouseUp = function () {/*do nothing*/};

            if(!this.selection.dragging) {
                return;
            }
            
            this.editTool.closeActionGroup();
            this.selection.dragging = false;
        };


        /**
         * Attaches all the necessary listeners to handle a resizing action.
         *
         * @this EditFrame
         */
        function handleSelectionBoxResizing() {
            var selectorBoxWrapper = this.selectionLayer;//this.selection.element;
            var last;

            var mouseMove = function (event) {

                if (!this.selection.resizing) return;

                var cursor = cursorRelativePosition(event, this.selectionLayer);

                var movement = {
                    x: cursor.x - last.x,
                    y: cursor.y - last.y
                };

                last = cursor;

                var x = this.selection.x,
                    y = this.selection.y,
                    width = this.selection.width,
                    height = this.selection.height,
                    rotation = this.selection.rotation;

                //get the direction of the arrow beign dragged
                var direction = this.selection.handle.resizing.getAttribute('data-sdp-handle');
                var translations = {
                    n: function () {
                        y += movement.y;
                        height -= movement.y;
                    },
                    s: function () {
                        height += movement.y;
                    },
                    w: function () {
                        x += movement.x;
                        width -= movement.x;
                    },
                    e: function () {
                        width += movement.x;
                    },
                    nw: function () {
                        x += movement.x;
                        y += movement.y;
                        width -= movement.x;
                        height -= movement.y;
                    },
                    ne: function () {
                        y += movement.y;
                        width += movement.x;
                        height -= movement.y;
                    },
                    sw: function () {
                        x += movement.x;
                        width -= movement.x;
                        height += movement.y;
                    },
                    se: function () {
                        width += movement.x;
                        height += movement.y;
                    }
                };
                translations[direction]();
                updateSelectorBoxPosition.bind(this)(x, y, rotation);
                updateSelectorBoxDimensions.bind(this)(width, height);

            }.bind(this);

            var mouseUp = function (event) {
                last = null;
                this.selection.resizing = false;
                this.selection.handle.resizing = null;
                this.containingDiv.style.cursor = '';

                this.annotation.finishDragging();

                //this should never be called after the mouse up because we are no longer resizing
                this.onMouseMove = function () {/*do nothing*/
                };
                this.onMouseUp = function () {/*do nothing*/
                };
            }.bind(this);

            selectorBoxWrapper.addEventListener('mousedown', function (event) {
                var target = event.target;
                //is the target where the mousedown occured a drag point
                if (isDragPoint(target)) {

                    this.selection.resizing = true;
                    //keep a reference to the point where the drag started
                    this.selection.handle.resizing = target;
                    //figure out which direction this point should resize
                    var direction = this.selection.handle.resizing.getAttribute('data-sdp-handle');
                    //set the cursor position for the entire layer
                    this.containingDiv.style.cursor = direction + '-resize';

                    var cursor = cursorRelativePosition(event, this.selectionLayer);

                    //store it as the last position
                    last = cursor;

                    this.onMouseMove = mouseMove;
                    this.onMouseUp = mouseUp;

                    //notify the annotation that dragging has started
                    this.annotation.startDragging();
                }
            }.bind(this));
        };

        /**
         * Attaches double click listener and pass events to annotation, annotations such as text use it to enter text edit
         * mode.
         *
         * @this EditFrame
         */
        function handleSelectionDoubleClick() {
            var doubleClick = function (event) {
                this.selection.dragging = false;
                this.annotation && this.annotation.onDoubleClick(event);
            }.bind(this);

            var selectorBoxWrapper = this.selectionLayer;
            selectorBoxWrapper.addEventListener('dblclick', doubleClick);
        };

        /**
         * Determines the position of a mouse event relative to a given container.
         *
         * @param {MouseEvent}
         * @returns {Object} - the x and y coordinates
         */
        function cursorRelativePosition(mouseEvent, container) {
            return {
                x: mouseEvent.pageX - container.getBoundingClientRect().left,
                y: mouseEvent.pageY - container.getBoundingClientRect().top
            };
        }

        /**
         * Determines the position of coordinates after they have been rotated.
         *
         * @param {number} x - The x coordinate of the point to rotate
         * @param {number} y - The y coordinate of the point to rotate
         * @param {number} angle - The amount of degrees to rotate the given point
         * @returns {Object} - the x and y coordinates
         */
        function rotateXY(x, y, angle) {
            var radians = angle * (Math.PI / 180);
            return {
                x: Math.cos(radians) * x + -1 * Math.sin(radians) * y,
                y: Math.sin(radians) * x + Math.cos(radians) * y
            };
        }

        function togglePointerEvents(element, state) {
            element.style.pointerEvents = state ? 'auto' : 'none';
        }

//End closure
    })();

};
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotations = function() {

    /**
     * Base object for all Annotations.
     * @constructor
     */
    Autodesk.Comments2.Annotation = function(id, viewer) {

        this.id = id;
        this.type = 0;
        this.viewer = viewer;
        this.strokeWidth = 5;
        this.fontHeight = 10;

        this.clientWidth = 0;
        this.clientHeight = 0;
        this.clientPosition = {x: 0, y: 0};
        this.rotation = 0;
        this.constraintWidth = false;
        this.constraintHeight = false;
        this.constraintRotation = false;

        Autodesk.Comments2.addTrait_eventDispatcher(this);
    };

    /*
     * Constants
     */
    Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW     = 1;
    Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT2D    = 2;
    Autodesk.Comments2.Annotation.ANNOTATION_TYPE_RECTANGLE = 3;

    Autodesk.Comments2.Annotation.ANNOTATION_EXPORT_TYPE_LABEL = 'Label';
    Autodesk.Comments2.Annotation.ANNOTATION_EXPORT_TYPE_ARROW = 'Arrow';

    /*
     * Event types
     */
    Autodesk.Comments2.Annotation.EVENT_ANNOTATION_SELECTED = "EVENT_ANNOTATION_SELECTED";
    Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DRAGGING = "EVENT_ANNOTATION_DRAGGING";
    Autodesk.Comments2.Annotation.EVENT_ANNOTATION_ENTER_EDITION = "EVENT_ANNOTATION_ENTER_EDITION";
    Autodesk.Comments2.Annotation.EVENT_ANNOTATION_CANCEL_EDITION = "EVENT_ANNOTATION_CANCEL_EDITION";
    Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DELETE_EDITION = "EVENT_ANNOTATION_DELETE_EDITION";

    /**
     *
     * @param id
     * @returns {*}
     */
    Autodesk.Comments2.Annotation.getTypeString = function(id) {
        switch (id) {
            case Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT3D:
            case Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT2D:
                return Autodesk.Comments2.Annotation.ANNOTATION_EXPORT_TYPE_LABEL;
            case Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW:
                return Autodesk.Comments2.Annotation.ANNOTATION_EXPORT_TYPE_ARROW;
        }
        return 'Unknown('+id+')';
    };

    Autodesk.Comments2.Annotation.prototype.destroy = function (event) {
    };

    Autodesk.Comments2.Annotation.prototype.select = function() {
        this.fireEvent( {type: Autodesk.Comments2.Annotation.EVENT_ANNOTATION_SELECTED, annotation: this} );
    };

    Autodesk.Comments2.Annotation.prototype.startDragging = function() {
        this.select();
        this.fireEvent( {type: Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DRAGGING, annotation: this, dragging: true} );
    };

    Autodesk.Comments2.Annotation.prototype.finishDragging = function() {
        this.fireEvent( {type: Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DRAGGING, annotation: this, dragging: false} );
    };

    Autodesk.Comments2.Annotation.prototype.unselect = function() {
    };

    Autodesk.Comments2.Annotation.prototype.edit = function() {
        this.fireEvent( {type: Autodesk.Comments2.Annotation.EVENT_ANNOTATION_ENTER_EDITION, annotation: this} );
    };

    Autodesk.Comments2.Annotation.prototype.cancel = function() {
        this.fireEvent( {type: Autodesk.Comments2.Annotation.EVENT_ANNOTATION_CANCEL_EDITION, annotation: this} );
    };

    Autodesk.Comments2.Annotation.prototype.delete = function() {
        this.fireEvent( {type: Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DELETE_EDITION, annotation: this} );
    };

    Autodesk.Comments2.Annotation.prototype.setParent = function(parent) {
    };

    Autodesk.Comments2.Annotation.prototype.setClientPosition = function(x,y) {
    };

    Autodesk.Comments2.Annotation.prototype.getClientPosition = function() {

        return {x: this.clientPosition.x, y: this.clientPosition.y};
    };

    Autodesk.Comments2.Annotation.prototype.getClientWidth = function() {

        return this.clientWidth;
    };

    Autodesk.Comments2.Annotation.prototype.getClientHeight = function() {

        return this.clientHeight;
    };

    Autodesk.Comments2.Annotation.prototype.getRotation = function() {

        return this.rotation;
    };

    Autodesk.Comments2.Annotation.prototype.isWidthConstrained = function() {

        return this.constraintWidth;
    };

    Autodesk.Comments2.Annotation.prototype.isHeightConstrained = function() {

        return this.constraintHeight;
    };

    Autodesk.Comments2.Annotation.prototype.isRotationConstrained = function() {

        return this.constraintRotation;
    };

    /**
     *
     * @returns {number}
     */
    Autodesk.Comments2.Annotation.prototype.getStrokeWidth = function() {

        return this.strokeWidth;
    };

    /**
     *
     * @param width
     */
    Autodesk.Comments2.Annotation.prototype.setStrokeWidth = function(width) {
    };

    /**
     *
     * @returns {number}
     */
    Autodesk.Comments2.Annotation.prototype.getFontHeight = function() {

        return this.fontHeight;
    };

    Autodesk.Comments2.Annotation.prototype.constrainsToBounds = function(bounds) {
    };

    Autodesk.Comments2.Annotation.prototype.onKeyDown = function(event) {

        event.stopPropagation();
        switch (event.keyCode) {

            case Autodesk.Viewing.theHotkeyManager.KEYCODES.DELETE:
                if (this.selected && !this.editing) {
                    this.delete();
                }
                break;

            case Autodesk.Viewing.theHotkeyManager.KEYCODES.ESCAPE:
                this.cancel();
                break;
        }
    };

    Autodesk.Comments2.Annotation.prototype.onMouseDown = function(event) {

        this.select();
    };

    Autodesk.Comments2.Annotation.prototype.onMouseUp = function(event) {

    };

    Autodesk.Comments2.Annotation.prototype.onCameraChange = function(event) {

        this.rescale();
    };

    /**
     * Constructs a ViewerAnnotations object. ViewerAnnotations is an extension to viewer that permits add
     * annotations over the viewer's canvas.
     * @param {Autodesk.Viewing.Viewer} viewer
     * @constructor
     */
    Autodesk.Comments2.Annotations = function (viewer) {

        Autodesk.Viewing.Extension.call(this, viewer);
    };

    Autodesk.Comments2.Annotations.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
    Autodesk.Comments2.Annotations.prototype.constructor = Autodesk.Comments2.Annotations;

    /**
     * Initializes the extension and create its needed resources.
     */
    Autodesk.Comments2.Annotations.prototype.load = function () {
        // We only support Viewer3D. Bail out early if not.
        if (!(this.viewer instanceof Autodesk.Viewing.Viewer3D)) {
            return false;
        }

        this.annotations = [];
        this.annotationsVisible = true;

        // Overlays.
        this.overlaysGraphicsLayers = [];

        // Its not possible to composite canvas with children divs, so we add a wrapper for the line canvas
        // and the markers.
        this.annotationsWrap = document.createElement("div");
        this.annotationsWrap.id = "annotations-wrap";
        this.annotationsWrap.style.left = 0;
        this.annotationsWrap.style.top = 0;
        this.annotationsWrap.style.right = 0;
        this.annotationsWrap.style.bottom = 0;
        this.annotationsWrap.style.width = "100%";
        this.annotationsWrap.style.height = "100%";
        this.annotationsWrap.style.backgroundColor = "transparent";
        this.annotationsWrap.style.position = "absolute";

        // Create the canvas where lines will be draw.
        this.canvas = document.createElement("canvas");
        this.canvas.id = "annotations-lines";
        this.canvas.style.left = 0;
        this.canvas.style.top = 0;
        this.canvas.style.right = 0;
        this.canvas.style.bottom = 0;
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.style.backgroundColor = "transparent";
        this.canvas.style.position = "absolute";

        // Insert the markerWrap as the first child of the viewer container,
        // the lines should no be over other parts of the ui.
        this.container = this.viewer.container;

        if (this.container.firstChild) {
            this.container.insertBefore(this.annotationsWrap, this.container.firstChild);
        } else {
            this.container.appendChild(this.annotationsWrap);
        }
        this.annotationsWrap.appendChild(this.canvas);

        // Disable mouse event handling to allow the viewer to consume them.
        // The support of pointer-events property is recently added to all mayor browsers.
        this.annotationsWrap.style.pointerEvents = "none";

        // Create an overlay to highlight geometry associated with markers.
        this.materialBase = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.25, transparent: false });
        this.materialTop = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.01, shading: THREE.NoShading, transparent: true });

        this.viewer.impl.createOverlayScene("annotations", this.materialBase, this.materialTop);

        this.viewerBounds = new THREE.Box2();
        this.gizmosColor = "#4078A8";
        this.gizmosBorderColor = "#FFFFFF";

        // Add raycaster.
        this.raycaster = new THREE.Raycaster();

        // Add event listeners.
        this.onCameraChange = function () {
            this.update();
        }.bind(this);

        this.onExplodeChange = function () {
            this.update();
        }.bind(this);

        this.onViewerResize = function () {

            this.clientWidth = this.container.offsetWidth;
            this.clientHeight = this.container.offsetHeight;

            this.viewerBounds.min.x = 10;
            this.viewerBounds.min.y = 30;
            this.viewerBounds.max.x = this.clientWidth  - 10;
            this.viewerBounds.max.y = this.clientHeight - 10;

            // TODO: A better fix would be to update matrices before sending resize event.
            this.viewer.impl.updateCameraMatrices();
            this.update();
        }.bind(this);

        // Add UI entry in ViewerSettingsPanel.js.
        var that = this;
        var registerUiOption = function() {
            that.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, registerUiOption);

            var prefName = "showCommentMarkers";
            var defaultValue = true;
            var prefs = that.viewer.prefs;
            prefs.add(prefName, defaultValue, ['2d', '3d']);

            var viewerOptions = that.viewer.getSettingsPanel(false);
            that.optionsCheckboxId = viewerOptions.addCheckbox(Autodesk.Viewing.Extensions.ViewerSettingTab.Navigation, "Show Comment Markers", defaultValue, function() {
                that.update();
            }, "showCommentMarkers");
        };

        if (this.viewer.getSettingsPanel(false)) {
            registerUiOption();
        } else {
            this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, registerUiOption);
        }

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);
        this.viewer.addEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, this.onExplodeChange);
        this.viewer.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewerResize);

        this.onViewerResize();

        return true;
    };

    /**
     * Dispose resources created by this extension and remove event listeners.
     * @returns {boolean} True if unloading was successful.
     */
    Autodesk.Comments2.Annotations.prototype.unload = function () {

        // Remove event listeners.
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);
        this.viewer.removeEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, this.onExplodeChange);
        this.viewer.removeEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewerResize);

        this.viewer.prefs.remove("showCommentMarkers");
        this.viewer.getSettingsPanel(false).removeCheckbox(this.optionsCheckboxId);

        this.annotations.splice(0, this.annotations.length);

        this.annotationsWrap.parentNode.removeChild(this.annotationsWrap);
        this.viewer.impl.removeOverlayScene("annotations");

        this.materialBase.dispose();
        this.materialTop.dispose();

        this.overlaysGraphicsLayers = [];

        return true;
    };

    Autodesk.Comments2.Annotations.prototype.saveMetadata = function() {
        this.annotations.forEach(function(annot) {
            annot.saveMetadata();
        });
    };

    Autodesk.Comments2.Annotations.prototype.restoreFromDiv = function (svgDiv) {

        // Careful with svgDiv.childNodes; it is a 'live' array that changes
        // whenever one of its children changes parent.
        var count = svgDiv.childNodes.length;
        if (count === 0) {
            return;
        }
        var nodes = []; // Make a non-live array
        for (var i=0; i<count; ++i) {
            nodes.push(svgDiv.childNodes[i]);
        }
        nodes.forEach(function(divChild) {

            var metadata = divChild.getAttribute('metadata');
            if (!metadata) {
                return;
            }
            var annotation;
            var annoTypeData = metadata.split(';')[0]; // 'type:ABCD' information at index 0
            if (!annoTypeData) {
                return;
            }
            var annoType = annoTypeData.split(':')[1]; // get only the ABCD part
            switch (annoType) {
                case Autodesk.Comments2.Annotation.ANNOTATION_EXPORT_TYPE_LABEL:
                    // NOTE: We don't care about AnnotationText3d. For now.
                    annotation = new Autodesk.Comments2.AnnotationText2d(this.viewer);
                    annotation.setTextFromDiv(divChild);
                    break;
                case Autodesk.Comments2.Annotation.ANNOTATION_EXPORT_TYPE_ARROW:
                    annotation = new Autodesk.Comments2.AnnotationArrow(this.viewer, 10); // TODO: Revisit magic number 10
                    break;
            }
            if (annotation) {
                annotation.setParent(this.annotationsWrap);
                annotation.initFromMetadata(metadata);
                this.addAnnotation(annotation);
            }
        }.bind(this));
        this.update();
    };

    Autodesk.Comments2.Annotations.prototype.exitViewMode = function () {
        this.annotations.forEach(function(annot){
            annot.setParent(null);
        });
        this.annotations = [];
        this.update();
    };

    /**
     * Reposition and redraw the graphical elements of this extension; markers, highlights and lines.
     * Should be called when cameras, viewports, highlights, markers, lines or models change.
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.update = function () {

        if(!this.visible || !this.viewer.model) {
            return;
        }

        this.canvas.width  = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        var ctx = this.canvas.getContext("2d");
        if (!ctx) {
            return;
        }

        ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.updateAnnotations(ctx);
        this.updateOverlayGraphicsLayers(ctx);
    };

    /**
     * Reposition and redraw marker groups. Markers are grouped in clusters based on the model's node they belong.
     * @param {CanvasRenderingContext2D} ctx Context used to draw lines and other shapes associated to markers.
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.updateAnnotations = function (ctx) {

        this.updateProxiesCenters();

        // Update marker groups positions and resolve their collisions.
        var annotations = this.annotations;
        var annotationsCount = annotations.length;

        for (var i = 0; i < annotationsCount; ++i) {
            if (annotations[i].type != Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT3D) {
                annotations[i].onCameraChange();
                continue;
            }
            this.updateAnnotation(annotations[i]);
        }

        var drawRectangle = Autodesk.Comments2.drawRectangle;
        var drawCircle = Autodesk.Comments2.drawCircle;
        var drawText = Autodesk.Comments2.drawText;

        var gizmoColor = this.gizmosColor;
        var gizmoRadius = 10;
        var gizmoOffset = 10;
        var borderColor = this.gizmosBorderColor;
        var borderWidth = 2;

        for (var i = 0; i < annotationsCount; ++i) {

            if (annotations[i].type != Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT3D) {
                continue;
            }

            var group = annotations[i];

            var x = Math.round(group.x);
            var y = Math.round(group.y);
            if (group.clipped) {

                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.font = "12px Arial";
                ctx.globalAlpha = 1.00;

                if (group.hClipped) {

                    var circleCenterX = x + (group.flip ?-clippedSizeW + gizmoRadius : clippedSizeW - gizmoRadius);
                    var circleCenterY = y - gizmoOffset;
                    var rectangleX = x + (group.flip ? -clippedSizeW + gizmoRadius : 0);
                    var rectangleY = y - gizmoOffset - gizmoRadius - borderWidth;

                    if (group.flip) {
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius + borderWidth, borderColor);
                        drawRectangle(ctx, rectangleX, rectangleY, clippedSizeW - gizmoRadius, gizmoRadius*2 + borderWidth*2, borderColor);
                        drawRectangle(ctx, rectangleX, rectangleY + borderWidth, clippedSizeW - gizmoRadius, gizmoRadius*2, gizmoColor);
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius, gizmoColor);
                        drawText(ctx, circleCenterX, circleCenterY, group.number, borderColor);
                    } else {
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius + borderWidth, borderColor);
                        drawRectangle(ctx, rectangleX, rectangleY, clippedSizeW - gizmoRadius, gizmoRadius*2 + borderWidth*2, borderColor);
                        drawRectangle(ctx, rectangleX, rectangleY + borderWidth, clippedSizeW - gizmoRadius, gizmoRadius*2, gizmoColor);
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius, gizmoColor);
                        drawText(ctx, circleCenterX, circleCenterY, group.number, borderColor);
                    }
                }

                if (group.vClipped) {

                    var circleCenterX = x;
                    var circleCenterY = y + (group.flip ?-clippedSizeW + gizmoRadius: clippedSizeW - gizmoRadius);
                    var rectangleX = x - gizmoRadius - borderWidth;
                    var rectangleY = y - (group.flip ? clippedSizeW - gizmoRadius - borderWidth : 0);

                    if (group.flip) {
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius + borderWidth, borderColor);
                        drawRectangle(ctx, rectangleX, rectangleY, gizmoRadius*2 + borderWidth*2, clippedSizeW - gizmoRadius, borderColor);
                        drawRectangle(ctx, rectangleX+ borderWidth, rectangleY, gizmoRadius*2, clippedSizeW - gizmoRadius, gizmoColor);
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius, gizmoColor);
                        drawText(ctx, circleCenterX, circleCenterY, group.number, borderColor);
                    } else {
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius + borderWidth, borderColor);
                        drawRectangle(ctx, rectangleX, rectangleY, gizmoRadius*2 + borderWidth*2, clippedSizeW - gizmoRadius, borderColor);
                        drawRectangle(ctx, rectangleX + borderWidth, rectangleY, gizmoRadius*2, clippedSizeW - gizmoRadius, gizmoColor);
                        drawCircle(ctx, circleCenterX, circleCenterY, gizmoRadius, gizmoColor);
                        drawText(ctx, circleCenterX, circleCenterY, group.number, borderColor);
                    }
                }
            } else {

                // calculates occluded alpha
                var occludedAlpha = 1;

                var camera = this.viewer.impl.camera;
                var forward = camera.position.clone().sub(camera.target);
                forward.normalize();

                var world = this.viewer.impl.getRenderProxy(this.viewer.model, group.fragmentId).matrixWorld;
                var normal = group.normal.clone();
                normal = normal.transformDirection(world);

                occludedAlpha = normal.dot(forward);
                occludedAlpha = Math.max(0, occludedAlpha);
                occludedAlpha = Math.easeClamp(occludedAlpha, 0, 0.2);

                // draw connector point
                for( var j = 0; j < gizmoOffset; j +=3 ) {
                    ctx.globalAlpha = occludedAlpha * 0.65;
                    drawRectangle(ctx, x+1, y - gizmoOffset + j+1, 1, 1, gizmoColor);
                    ctx.globalAlpha = occludedAlpha * 1.00;
                    drawRectangle(ctx, x, y - gizmoOffset + j, 1, 1, borderColor);
                }

                ctx.globalAlpha = occludedAlpha * 0.65;
                drawCircle(ctx, x + 1.5, y+1, 2, gizmoColor);
                ctx.globalAlpha = occludedAlpha * 1.00;
                drawCircle(ctx, x + 0.5, y, 2, borderColor);

                // draw text box
                var textW = group.getWidth();

                var boxX = x;
                var boxY = y - gizmoOffset - group.getHeight();
                var boxW = textW;

                var boxO =-9;
                var minO = 9;
                var maxO = boxW -9;

                // scroll annotations
                var s = x / this.clientWidth;
                boxO = -minO - Math.round(s * (maxO - minO));

                group.setAlpha(occludedAlpha);
                group.setClientPosition(boxX + boxO, boxY);

                // draw connector line
                ctx.globalAlpha = occludedAlpha * 0.75;
                for( var j = 0; j < boxW; j +=3 ) {
                    drawRectangle(ctx, x + boxO + j, y - gizmoOffset, 1, 1, "#ffffff");
                }
            }
        }
    }

    /**
     * Clear annotations.
     */
    Autodesk.Comments2.Annotations.prototype.clear = function() {

        var annotations = this.annotations;
        var annotationsCount = annotations.length;

        for (var i = 0; i < annotationsCount; ++i) {
            annotations[i].destroy();
        }

        annotations.splice(0,annotationsCount);
        this.update();
    }

    Autodesk.Comments2.Annotations.prototype.getAnnotations = function() {

        return this.annotations;
    };

    Autodesk.Comments2.Annotations.prototype.addAnnotation = function(annotation) {

        this.annotations.push(annotation);

        // Move this code to EditModeText3d when implemented.
        /*  if (attributes.fragmentId == -1 && !attributes.position)  {
         return false;
         }

         parent = parent ? parent : this.annotationsWrap;
         var annotation = new Autodesk.Comments2.Annotation3d(id, attributes, this, parent);
         this.annotations.push(annotation);

         this.update();
         return annotation; */
    }

    /**
     * Remove a marker from the viewer. It can be used to remove node and model markers.
     * @param {string} id Id of the marker to remove.
     */
    Autodesk.Comments2.Annotations.prototype.removeAnnotation = function (annotation) {

        var annotationIndex = this.annotations.indexOf(annotation);
        if (annotationIndex != -1) {
            this.annotations.splice(annotationIndex, 1);
        }
        this.update();
    }

    /**
     * Returns true if extension elements are visible.
     * @returns {Boolean} True if extension elements are visible.
     */
    Autodesk.Comments2.Annotations.prototype.__defineGetter__('visible', function () {

        return this.annotationsWrap.style.display == "block" || this.annotationsWrap.style.display == "";
    } );

    /**
     * Make all extension elements visible.
     */
    Autodesk.Comments2.Annotations.prototype.show = function () {

        this.annotationsWrap.style.display = "block";
        this.update();
    }

    /**
     * Make all extension elements hidden.
     */
    Autodesk.Comments2.Annotations.prototype.hide = function () {

        this.annotationsWrap.style.display = "none";
    }

    /**
     * Set visibility for node and model markers; lines and highlights are not affected by this method.
     * @param {boolean} isVisible
     */
    Autodesk.Comments2.Annotations.prototype.setAnnotationsVisible = function(isVisible) {

        if (isVisible == this.annotationsVisible) {
            return;
        }

        this.annotationsVisible = isVisible;
        this.update();
    }

    /**
     * Returns a fragment id associated to a model's node id.
     * @param {number} nodeId Id of the model's node whose fragment id is required.
     * @returns {number} The first fragment id found or -1 if no fragment was found.
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.getFragmentId = function(dbId) {

        if (this.viewer.model === null) {
            return -1;
        }

        var fragId2dbId = this.viewer.model.getData().fragments.fragId2dbId;
        var fragId2dbIdCount = fragId2dbId.length;

        for (var i = 0; i < fragId2dbIdCount; ++i) {
            if (fragId2dbId[i] == dbId) {
                return i;
            }
        }
        return -1;
    }

    Autodesk.Comments2.Annotations.prototype.getNodeId = function(fragmentId) {

        if (this.viewer.model === null) {
            return -1;
        }

        var fragId2dbId = this.viewer.model.getData().fragments.fragId2dbId;
        var fragId2dbIdCount = fragId2dbId.length;

        if (fragmentId < 0 || fragmentId >= fragId2dbIdCount)
        {
            return -1;
        }

        return fragId2dbId[fragmentId];
    }

    /**
     * Returns the index of the first element in the provided array with the same id passed as
     * parameter.
     * @param {object} id Id of the element whose index is required.
     * @param {array} array Array used to search the element.
     * @returns {number} Index of the element found or -1 if no element was found.
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.getIndexFromId = function(id, array) {

        var count = array.length;
        for (var i = 0; i < count; ++i) {
            if (array[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Calculates the bounding box's center in client space coordinates of the fragment with the provided id.
     * The center is offsetted by the offset associated to the group at node marker creating time.
     * @param {number} fragId Id of the fragment whose center is required.
     * @param {THREE.Vector3} [offset] And offset in model space coordinates that can be applied to the calculated proxy's
     * bounding box center.
     * @returns {THREE.Vector3} Bounding box's center transformed and projected into client space
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.getProxyCenter = function(fragId, offset) {

        if (fragId == -1) {

            return offset;
        } else {

            var proxy = this.viewer.impl.getRenderProxy(this.viewer.model, fragId);
            var proxyCenter = proxy.geometry.boundingBox.center();

            if (offset) {
                proxyCenter.add(offset);
            }

            proxyCenter.applyMatrix4(proxy.matrixWorld);
            return Autodesk.Comments2.worldToClient(proxyCenter, this.viewer);
        }
    }

    /**
     * Toggles highlight for the whole model.
     * @param {boolean} highlight Whether we want to highlight the whole model or not.
     */
    Autodesk.Comments2.Annotations.prototype.setModelHighlight = function (highlight) {

        if(!this.viewer.model || this.viewer.model.is2d()) {
            return;
        }

        this.clearHighlightedNodes();

        if (highlight) {
            this.highlightNode(this.viewer.model.getRoot());
        }
    }

    Autodesk.Comments2.Annotations.prototype.addOverlayGraphicsLayer = function(id, index, drawCallback) {

        function comparer(layerA, layerB) {

            if (layerA.index < layerB.index) {
                return-1;
            }

            if (layerA.index > layerB.index) {
                return 1;
            }

            return 0;
        }

        var layer = {
            id: id,
            index: index,
            drawCallback: drawCallback
        };

        this.overlaysGraphicsLayers.push(layer);
        this.overlaysGraphicsLayers.sort(comparer);
    }

    Autodesk.Comments2.Annotations.prototype.removeOverlayGraphicsLayer = function(id) {

        var index = this.getIndexFromId(id, this.overlaysGraphicsLayers);
        if (index != -1) {
            this.overlaysGraphicsLayers.splice(index, 1);
        }
    }

    /**
     *
     * @param ctx
     */
    Autodesk.Comments2.Annotations.prototype.updateOverlayGraphicsLayers = function(ctx) {

        var layers = this.overlaysGraphicsLayers;
        var layerCount = layers.length;

        for (var i = 0; i < layerCount; ++i) {
            layers[i].drawCallback(ctx);
        }
    }

    /**
     * Calculates the initial position of a marker group, that is, collisions with other markers are not resolved.
     * @param {object} group Marker group that will be positioned.
     * @param {THREE.Vector2} modelCenter
     * @param {number} modelMinX
     * @param {number} modelMaxX
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.updateAnnotation = function(annotation) {

        annotation.x = annotation.proxyCenter.x;
        annotation.y = annotation.proxyCenter.y;

        this.restrainToViewerBounds(annotation);
    }

    /**
     * Calculates and sets to all marker groups their proxies' centers (node's bounding box center transformed and projected
     * into client space coordinates).
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.updateProxiesCenters = function() {

        var annotations = this.annotations;
        var annotationsCount = annotations.length;

        for (var i = 0; i < annotationsCount; ++i) {

            var annotation = annotations[i];
            if (annotation.type != Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT3D) {
                continue;
            }
            annotation.proxyCenter = this.getProxyCenter(annotation.fragmentId, annotation.position);
        }
    }

    /**
     * Snap clipped marker group's position to the Viewer client area's borders.
     * @param {object} group Marker group whose position will be restrained.
     * @private
     */
    Autodesk.Comments2.Annotations.prototype.restrainToViewerBounds = function(annotation) {

        var viewerBounds = this.viewerBounds;

        annotation.hClipped =
            (annotation.x < this.viewerBounds.min.x || annotation.x > this.viewerBounds.max.x);

        annotation.vClipped = !annotation.hClipped &&
        (annotation.y < this.viewerBounds.min.y || annotation.y > this.viewerBounds.max.y);

        annotation.clipped = annotation.hClipped || annotation.vClipped;

        if (annotation.x < viewerBounds.min.x) {

            annotation.x = 0;
            annotation.flip = false;
        } else
        if (annotation.x > viewerBounds.max.x) {

            annotation.x = this.clientWidth;
            annotation.flip = true;
        }

        if (annotation.y < viewerBounds.min.y) {

            annotation.y = annotation.hClipped ? 28 : 0;
            !annotation.hClipped && (annotation.flip = false);
        }
        else
        if (annotation.y > viewerBounds.max.y) {

            annotation.y = this.clientHeight;
            !annotation.hClipped && (annotation.flip = true);
        }
    }

    Autodesk.Comments2.Annotations.prototype.enterEditMode = function(parent) {

        for(var i = 0; i < this.annotations.length; i++) {
            this.annotations[i].setParent(parent);
        }
        this.update();
    };

    Autodesk.Comments2.Annotations.prototype.leaveEditMode = function() {

        for(var i = 0; i < this.annotations.length; i++) {
            this.annotations[i].setParent(this.annotationsWrap);
        }
        this.update();
    };

    /**
     * Gets the extension state as a plain object. Intended to be called when viewer state is requested.
     * @param {object} viewerState Object to inject extension values.
     */
    Autodesk.Comments2.Annotations.prototype.getState = function(viewerState) {

        if (!viewerState.tags){
            viewerState.tags = new Array();
        }

        var tags = viewerState.tags;
        var annotations = this.annotations;
        var annotationsCount = annotations.length;

        for (var i = 1; i <= annotationsCount; ++i) {

            var annotation = annotations[i-1];
            if (annotation.type != Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT3D) {
                continue;
            }
            var annotationName = "Annotation" + (i >= 10 ? i.toString() : "0" + i);

            tags.push( {
                name: annotationName,
                type: "TextOver3d",
                id: annotation.id,
                nodeId: annotation.nodeId,
                fragmentId: annotation.fragmentId,
                text: annotation.getText(),
                normal: annotation.normal.toArray(),
                position: annotation.position.toArray()
            });
        }
        return true;
    };

    /**
     * Restores the extension state from a given object.
     * @param {object} viewerState
     * @param {boolean} [immediate] - Whether the new view is applied with (true) or without transition (false)
     * @returns {boolean} true if restore operation was successful.
     */
    Autodesk.Comments2.Annotations.prototype.restoreState = function (viewerState, immediate) {

        this.clear();

        var tags = viewerState.tags;
        var tagsCount = tags ? tags.length : 0;

        for (var i = 0; i < tagsCount; ++i) {

            var tag = tags[i];
            if (tag.name.indexOf("Annotation") != -1) {

                var position = tag.position;
                var normal = tag.normal;

                tag.position = new THREE.Vector3().fromArray(tag.position);
                tag.normal = new THREE.Vector3().fromArray(tag.normal);
                var annotation = this.addAnnotation(tag.id, tag, this.annotationsWrap);
                annotation.setText(tag.text);

                tag.position = position;
                tag.normal = normal;
            }
        }

        this.update();
    }

    /**
     * Register the extension with the extension manager.
     */
    Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Comments2.Annotations', Autodesk.Comments2.Annotations);


} //Autodesk.Comments2.importViewerAnnotations
/**
 * Contains functions used by ViewerMarker, ViewerMarkups and ViewerPinTool.
 */
namespaceFunction('Autodesk.Comments2');

/**
 * Creates an frame to be used when a extension enters edit mode.
 * @param {Array} buttons
 * @param {Function} [onClickCallback]
 * @returns {*}
 * @private
 */
Autodesk.Comments2.createEditFrame = function(buttons, onClickCallback) {

    var editFrameObject = {};
    editFrameObject.buttons = buttons;

    var frameDiv = document.createElement("div");

    frameDiv.className = "comments-edit-frame";
    frameDiv.id = "comments-edit-frame";
    frameDiv.style.left = 0;
    frameDiv.style.top = 0;
    frameDiv.style.right = 0;
    frameDiv.style.bottom = 0;
    frameDiv.style.backgroundColor = "transparent";
    frameDiv.style.position = "absolute";

    // Add markup drawing cancel message.
    var buttonBar = document.createElement("div");
    buttonBar.className = "comments-edit-frame-buttons-container";
    frameDiv.appendChild(buttonBar);

    var initialPosition = 4;
    var buttonWidth = 36;
    var position = initialPosition;
    for( var i = 0; i < buttons.length; ++i ) {

        var button = document.createElement("reset");
        buttons[i].button = button;

        // Add markup drawing cancel button.
        var onButtonClick = function(event) {

            event.stopPropagation();
            var indexArray = event.currentTarget.getAttribute('data-index');
            var buttonData = buttons[indexArray];
            onClickCallback && onClickCallback(buttonData);
        };

        button.className = "comments-edit-frame-reset";
        button.id = buttons[i].id;
        button.addEventListener("mousemove", function(event) { event.stopPropagation(); });
        button.addEventListener("mouseup", function(event) { event.stopPropagation(); });
        button.addEventListener("mousedown", function(event) { event.stopPropagation(); });
        button.addEventListener("click", onButtonClick);
        button.addEventListener("dblClick", onButtonClick);
        button.data = buttons[i].data;
        button.style.left = position + 'px';
        button.setAttribute('data-index', String(i));
        buttonBar.appendChild(button);

        position += buttonWidth;
    }

    editFrameObject.frameDiv = frameDiv;
    editFrameObject.buttonsDiv = buttonBar;
    return editFrameObject;
};

/**
 *
 * @param {Function} onUndoCallback
 * @param {Function} onRedoCallback
 */
Autodesk.Comments2.createUndoToolbar = function(onUndoCallback, onRedoCallback) {

    var panel = document.createElement("div");
    panel.className = "comments-edit-undo-toolbar";
    panel.id = 'comments-edit-undo-toolbar';

    // Create Undo/Redo buttons.
    var buttonUndo = document.createElement("button");

    buttonUndo.className = "comments-edit-frame-button";
    buttonUndo.id = 'undo';
    buttonUndo.addEventListener("mousemove", function(event) { event.stopPropagation(); });
    buttonUndo.addEventListener("mouseup", function(event) { event.stopPropagation(); });
    buttonUndo.addEventListener("mousedown", function(event) { event.stopPropagation(); });
    buttonUndo.addEventListener("click", onUndoCallback);
    buttonUndo.addEventListener("dblClick", onUndoCallback);
    buttonUndo.textContent = 'undo'; // TODO: Localize
    panel.appendChild(buttonUndo);
    panel.undoButton = buttonUndo;

    // Create Redo button.
    var buttonRedo = document.createElement("button");

    buttonRedo.className = "comments-edit-frame-button";
    buttonRedo.id = 'redo';
    buttonRedo.addEventListener("mousemove", function(event) { event.stopPropagation(); });
    buttonRedo.addEventListener("mouseup", function(event) { event.stopPropagation(); });
    buttonRedo.addEventListener("mousedown", function(event) { event.stopPropagation(); });
    buttonRedo.addEventListener("click", onRedoCallback);
    buttonRedo.addEventListener("dblClick", onRedoCallback);
    buttonRedo.textContent = 'redo'; // TODO: Localize
    panel.appendChild(buttonRedo);
    panel.redoButton = buttonRedo;

    return panel;
};

/**
 * Shows panels and tools in the viewer.
 * @param viewer
 */
Autodesk.Comments2.showToolsAndPanels = function(viewer) {

    // Restore view cube.
    if(!viewer.model.is2d()) {
        viewer.displayViewCube(true, false);
    }

    // TODO: Find or ask for a better way to restore this buttons.
    // Hide home and info button.
    var home = document.getElementsByClassName('homeViewWrapper');
    var info = document.getElementsByClassName('infoButton');
    var anim = document.getElementsByClassName('toolbar-animationSubtoolbar');

    if (home.length > 0) {
        home[0].style.display = '';
    }

    if (info.length > 0) {
        info[0].style.display = '';
    }

    if (anim.length > 0) {
        anim[0].style.display = '';
    }

    var viewerContainer = viewer.toolbar.container;
    var viewerContainerChildrenCount = viewerContainer.children.length;
    for(var i = 0; i < viewerContainerChildrenCount; ++i) {
        viewerContainer.children[i].style.display = "";
    }
};

/**
 * Hides panels and tools in the viewer.
 * @param viewer
 */
Autodesk.Comments2.hideToolsAndPanels = function(viewer) {

    // Hide Panels and tools.
    if(!viewer.model.is2d()) {
        viewer.displayViewCube(false, false);
    }

    // TODO: Find or ask for a better way to hide this buttons.
    // Hide home and info button.
    var home = document.getElementsByClassName('homeViewWrapper');
    var info = document.getElementsByClassName('infoButton');
    var anim = document.getElementsByClassName('toolbar-animationSubtoolbar');

    if (home.length > 0) {
        home[0].style.display = 'none';
    }

    if (info.length > 0) {
        info[0].style.display = 'none';
    }

    if (anim.length > 0) {
        anim[0].style.display = 'none';

        var animator = viewer.impl.keyFrameAnimator;
        if (animator && !animator.isPaused) {
            animator.pauseCameraAnimations();
            animator.pause();

            var playButton = viewer.modelTools.getControl('toolbar-animationPlay');
            if (playButton) {
                playButton.setIcon('toolbar-animationPauseIcon');
                playButton.setToolTip('Pause');
            }
        }
    }

    var viewerContainer = viewer.toolbar.container;
    var viewerContainerChildrenCount = viewerContainer.children.length;
    for(var i = 0; i < viewerContainerChildrenCount; ++i) {
        viewerContainer.children[i].style.display = "none";
    }
};

/**
 * Returns the mouse pointer position in viewer's client coordinate space.
 * @param {MouseEvent} event Mouse event.
 * @param {HTMLElement} [referenceFrame]
 * @returns {THREE.Vector2} Position of the mouse pointer.
 * @private
 */
Autodesk.Comments2.getMousePosition = function(event, referenceFrame) {

    var target = event.target || event.srcElement;
    var rect = referenceFrame ? referenceFrame.getBoundingClientRect() : target.getBoundingClientRect();

    return new THREE.Vector2(
        event.clientX - rect.left,
        event.clientY - rect.top);
};

/**
 *
 * @param point
 * @returns {THREE.Vector3}
 */
Autodesk.Comments2.worldToViewport = function(point, viewer) {

    var p = new THREE.Vector3();

    p.x = point.x;
    p.y = point.y;
    p.z = point.z;

    p.project(viewer.impl.camera);
    return p;
};

/**
 * Calculates the pixel position in client space coordinates of a point in world space.
 * @param {THREE.Vector3} point Point in world space coordinates.
 * @returns {THREE.Vector3} Point transformed and projected into client space coordinates.
 * @private
 */
Autodesk.Comments2.worldToClient = function(point, viewer) {

    var p = Autodesk.Comments2.worldToViewport(point, viewer);
    var result = viewer.impl.viewportToClient(p.x, p.y);

    // snap to the center of the pixel
    result.x = Math.floor(result.x) + 0.5;
    result.y = Math.floor(result.y) + 0.5;
    result.z =-p.z;

    return result;
};

Autodesk.Comments2.clientToWorld = function(clientX, clientY, depth, viewer) {

    var point = viewer.impl.clientToViewport(clientX, clientY);
    point.z = depth;

    point.unproject(viewer.impl.camera);
    return point;
};

/**
 *
 * @param width
 * @param viewerd
 * @returns {*}
 */
Autodesk.Comments2.getClientStrokeWidth = function(width, viewer) {

    if (viewer.model.is2d()) {

        var clientA = this.worldToClient(new THREE.Vector3(0,0,0), viewer);
        var clientB = this.worldToClient(new THREE.Vector3(width,0,0), viewer);

        return clientA.sub(clientB).length();
    } else {

        return viewer.container.clientHeight * width;
    }
};

/**
*
* @param height
* @param viewerd
* @returns {*}
*/
Autodesk.Comments2.getClientFontHeight = function(height, viewer) {

    if (viewer.model.is2d()) {

        var clientA = Autodesk.Comments2.worldToViewport(new THREE.Vector3(0,0,0), viewer);
        clientA = viewer.impl.viewportToClient(clientA.x, clientA.y);

        var clientB = Autodesk.Comments2.worldToViewport(new THREE.Vector3(0,height,0), viewer);
        clientB = viewer.impl.viewportToClient(clientB.x, clientB.y);

        return clientA.sub(clientB).length();
    } else {

        return viewer.container.clientHeight * height;
    }
};

/**
 *
 * @param value
 * @param units
 */
Autodesk.Comments2.metersToModel = function(meters, viewer) {

    var modelToMeter = viewer.model.getUnitScale();
    var meterToModel = 1 / modelToMeter;

    return meterToModel * meters;
}

/**
 * Draw a line segment over the viewer.
 * @param {CanvasRenderingContext2D} ctx Context used to draw the line.
 * @param {Number} xO Initial position in x-axis of the line segment.
 * @param {Number} yO Initial position in y-axis of the line segment.
 * @param {Number} xF Final position in x-axis of the line segment.
 * @param {Number} yF Final position in y-axis of the line segment.
 * @param {string} color Color used to draw the line segment.
 * @private
 */
Autodesk.Comments2.drawLine = function (ctx, xO, yO, xF, yF, color) {

    ctx.beginPath();
    ctx.moveTo(xO, yO);
    ctx.lineTo(xF, yF);
    ctx.strokeStyle = color;
    ctx.stroke();
};

/**
 * Draw a circle over the viewer.
 * @param {CanvasRenderingContext2D} ctx Context used to draw the circle.
 * @param {number} x X-axis position of the center of circle.
 * @param {number} y Y-axis position of the center of circle.
 * @param {number} radius Radius of the circle.
 * @param {string} color Color used to draw the circle.
 * @private
 */
Autodesk.Comments2.drawCircle = function(ctx, x, y, radius, color) {

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
};

Autodesk.Comments2.drawText = function(ctx, x, y, text, color) {

    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
};

Autodesk.Comments2.drawRectangle = function(ctx, x, y, w, h, color) {

    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
};

/**
 * Draw a circumference over the viewer.
 * @param {CanvasRenderingContext2D} ctx - Context used to draw the circumference.
 * @param {number} x X-axis position of the center of the circumference.
 * @param {number} y Y-axis position of the center of the circumference.
 * @param {number} radius Radius of the circumference.
 * @param {string} color Color used to draw the circumference.
 * @private
 */
Autodesk.Comments2.drawCircumference = function(ctx, x, y, radius, color) {

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color;
    ctx.stroke();
};

/**
 * Return the offset needed to be applied to pixel positions to a draw a stroke avoiding re-sampling.
 * @param strokeWidth
 * @returns {number}
 */
Autodesk.Comments2.getPixelOffset = function(strokeWidth) {

    return strokeWidth % 2 == 0 ? 0 : 0.5;
};

/**
 *
 * @param hide
 * @param viewer
 */
Autodesk.Comments2.hidePanels = function(hide, viewer) {

    var dockingPanels = viewer.dockingPanels;
    for (var i = 0; i < dockingPanels.length; ++i) {
        var panel = dockingPanels[i];
        var panelContainer = panel.container;

        if (panelContainer.classList.contains("dockingPanelVisible")) {
            panelContainer.style.display = hide ? "none" : "block";

            // Call the visibility changed notification if any additional
            // stuff needs to be done (update the date i.e. PropertyPanel, etc).
            panel.visibilityChanged();
        }
    }
};

/**
 *
 * @param parent
 * @param index
 * @returns {*}
 */
Autodesk.Comments2.getSVGChild = function(parent, index) {

    if (parent.children) {
        return parent.children[index];
    }

    if (parent.childNodes) {
        return parent.childNodes[index]
    }

    console.warn("Failed to get svg child node.");
    return null;
};
Autodesk.Comments2.importAnnotationsCreateArrow = function() {

    /**
     * @constructor
     */
    Autodesk.Comments2.CreateArrow = function (editTool, id, head, tail, strokeWidth, color) {

        Autodesk.Comments2.EditAction.call(this, editTool, 'CREATE-ARROW', id);
        this.selectOnExecution = false;

        this.tail = tail;
        this.head = head;
        this.strokeWidth = strokeWidth;
        this.color = color;
    };

    Autodesk.Comments2.CreateArrow.prototype = Object.create(Autodesk.Comments2.EditAction.prototype);
    Autodesk.Comments2.CreateArrow.prototype.constructor = Autodesk.Comments2.CreateArrow;

    Autodesk.Comments2.CreateArrow.prototype.redo = function() {

        var editTool = this.editor;
        var arrow = new Autodesk.Comments2.AnnotationArrow(this.targetId, editTool.viewer, this.strokeWidth, this.color);

        editTool.addAnnotation(arrow);
        arrow.set(this.head.x, this.head.y, this.tail.x, this.tail.y);
        arrow.created();
    };

    Autodesk.Comments2.CreateArrow.prototype.undo = function() {

        var arrow = this.editor.getAnnotation(this.targetId);
        arrow && this.editor.removeAnnotation(arrow);
    };
};

Autodesk.Comments2.importAnnotationsCreateText = function() {

    /**
     *
     * @param editTool
     * @param id
     * @param text
     * @param position
     * @param width
     * @param height
     * @param fontHeight
     * @param fontFamily
     * @param color
     * @constructor
     */
    Autodesk.Comments2.CreateText = function (editTool, id, text, position, width, height, fontHeight, fontFamily, color) {

        Autodesk.Comments2.EditAction.call(this, editTool, 'CREATE-TEXT', id);

        this.text = text;
        this.position = {x: position.x, y: position.y};
        this.width = width;
        this.height = height;
        this.fontHeight = fontHeight;
        this.fontFamily = fontFamily;
        this.color = color;
    };

    Autodesk.Comments2.CreateText.prototype = Object.create(Autodesk.Comments2.EditAction.prototype);
    Autodesk.Comments2.CreateText.prototype.constructor = Autodesk.Comments2.CreateText;

    Autodesk.Comments2.CreateText.prototype.redo = function () {

        var editor = this.editor;
        var text2d = new Autodesk.Comments2.AnnotationText2d(
            this.targetId,
            editor.viewer,
            this.text,
            this.width,
            this.height,
            this.fontHeight,
            this.fontFamily,
            this.color);

        editor.addAnnotation(text2d);
        text2d.setClientPosition(this.position.x, this.position.y);
    };

    Autodesk.Comments2.CreateText.prototype.undo = function () {

        var text = this.editor.getAnnotation(this.targetId);
        if (text) {
            this.editor.removeAnnotation(text);
            text.destroy();
        }
    };
};

Autodesk.Comments2.importAnnotationsDeleteArrow = function() {

    /**
     * @constructor
     */
    Autodesk.Comments2.DeleteArrow = function(editTool, arrow) {

        Autodesk.Comments2.EditAction.call(this, editTool, 'DELETE-ARROW', arrow.id);

        this.createArrow = new Autodesk.Comments2.CreateArrow(
            editTool,
            arrow.id,
            arrow.head,
            arrow.tail,
            arrow.strokeWidth,
            arrow.color);
    };

    Autodesk.Comments2.DeleteArrow.prototype = Object.create(Autodesk.Comments2.EditAction.prototype);
    Autodesk.Comments2.DeleteArrow.prototype.constructor = Autodesk.Comments2.DeleteArrow;

    Autodesk.Comments2.DeleteArrow.prototype.redo = function() {

        this.createArrow.undo();
    };

    Autodesk.Comments2.DeleteArrow.prototype.undo = function() {

        this.createArrow.redo();
    };
};

Autodesk.Comments2.importAnnotationsDeleteText = function() {

    /**
     *
     * @param editTool
     * @param annotation
     * @constructor
     */
    Autodesk.Comments2.DeleteText = function(editTool, annotation) {

        Autodesk.Comments2.EditAction.call(this, editTool, 'DELETE-TEXT', annotation.id);
        this.createText = new Autodesk.Comments2.CreateText(
            editTool,
            annotation.id,
            annotation.getText(),
            annotation.getClientPosition(),
            annotation.getClientWidth(),
            annotation.getClientHeight(),
            annotation.getFontHeight(),
            annotation.fontFamily,
            annotation.color
        );
    };

    Autodesk.Comments2.DeleteText.prototype = Object.create(Autodesk.Comments2.EditAction.prototype);
    Autodesk.Comments2.DeleteText.prototype.constructor = Autodesk.Comments2.DeleteText;

    Autodesk.Comments2.DeleteText.prototype.redo = function() {

        this.createText.undo();
    };

    Autodesk.Comments2.DeleteText.prototype.undo = function() {

        this.createText.redo();
    };
};
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsEditAction = function() {

    /**
     *
     * @param targetId
     * @param editor
     * @constructor
     */
    Autodesk.Comments2.EditAction = function(editor, type, targetId) {

        this.type =  type;
        this.editor = editor;
        this.targetId = targetId;
        this.addToHistory = true;
        this.selectOnExecution = true;
    };

    Autodesk.Comments2.EditAction.prototype.execute = function() {

        this.editor.actionManager.execute(this);
    };

    Autodesk.Comments2.EditAction.prototype.redo = function() {

    };

    Autodesk.Comments2.EditAction.prototype.undo = function() {

    };

    /**
     *
     * @param action
     * @returns {boolean}
     */
    Autodesk.Comments2.EditAction.prototype.merge = function(action) {

        return false;
    };

    /**
     * @returns {boolean}
     */
    Autodesk.Comments2.EditAction.prototype.isIdentity = function() {

        return false;
    };
};

namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsEditActionGroup = function() {

    /**
     * This class will group actions edit actions that should be executed as a whole.
     * When a group is open actions can be added to it, similar actions will be merged into one during this process.
     * This class is not intended to be used by users, it's a helper class of EditActionManager.
     * @constructor
     */
    Autodesk.Comments2.EditActionGroup = function() {

        this.actions = [];
        this.closed = true;
    };

    /**
     *
     * @returns {boolean}
     */
    Autodesk.Comments2.EditActionGroup.prototype.open = function() {

        if(!this.closed) {
            return false;
        }

        this.closed = false;
        return true;
    };

    /**
     *
     * @returns {boolean}
     */
    Autodesk.Comments2.EditActionGroup.prototype.close = function() {

        if (this.closed) {
            return false;
        }

        this.closed = true;
        return true;
    };

    /**
     *
     * @returns {number} targetId
     */
    Autodesk.Comments2.EditActionGroup.prototype.undo = function() {

        var actions = this.actions;
        var actionsMaxIndex = actions.length - 1;

        var targetId = -1;
        for(var i = actionsMaxIndex; i >= 0; --i) {

            var action =  actions[i];
            action.undo();

            if (action.targetId !== -1) {
                targetId = action.targetId;
            }
        }

        return targetId;
    };

    /**
     *
     * @returns {number} targetId
     */
    Autodesk.Comments2.EditActionGroup.prototype.redo = function() {

        var actions = this.actions;
        var actionsCount = actions.length;

        var targetId = -1;
        for(var i = 0; i < actionsCount; ++i) {

            var action =  actions[i];
            action.redo();

            if (action.targetId !== -1) {
                targetId = action.targetId;
            }
        }

        return targetId;
    };

    /**
     *
     * @returns {boolean}
     */
    Autodesk.Comments2.EditActionGroup.prototype.isOpen = function() {

        return !this.closed;
    };

    /**
     *
     * @returns {boolean}
     */
    Autodesk.Comments2.EditActionGroup.prototype.isClosed = function() {

        return this.closed;
    };

    /**
     *
     * @returns {boolean}
     */
    Autodesk.Comments2.EditActionGroup.prototype.isEmpty = function() {

        return this.actions.length === 0;
    };

    /**
     *
     * @param {Autodesk.Comments2.EditAction} action
     */
    Autodesk.Comments2.EditActionGroup.prototype.addAction = function(action) {

        if (this.closed) {
            return false;
        }

        this.actions.push(action);
        this.compact();

        return true;
    };

    /**
     * @private
     */
    Autodesk.Comments2.EditActionGroup.prototype.compact = function() {

        var actions = this.actions;
        var actionsCount = actions.length;

        for(var i = 0; i < actionsCount; ++i) {

            // If an action does nothing, remove it.
            var actionA = actions[i];
            if (actionA.isIdentity()) {
                actions.splice(i, 1);
                --actionsCount;
                --i;
                continue;
            }

            // If an action can be merged, merge it.
            for (var j = i + 1; j < actionsCount; ++j) {

                var actionB = actions[j];
                if (actionA.type === actionB.type &&
                    actionA.merge(actionB)) {
                    actions.splice(j, 1);
                    --actionsCount;
                    --i;
                    break;
                }
            }
        }
    };
};

namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsEditActionManager = function() {

    /**
     * Base object for all EditActionManager.
     * @constructor
     */
    Autodesk.Comments2.EditActionManager = function(historySize) {

        historySize = historySize ? historySize : 50;
        this.historySize = historySize;

        this.undoStack = new Array(historySize);
        this.redoStack = new Array(historySize);

        Autodesk.Comments2.addTrait_eventDispatcher(this);
    };

    /*
     * Event types
     */
    Autodesk.Comments2.EditActionManager.EVENT_HISTORY_CHANGED = "EVENT_HISTORY_CHANGED";

    /**
     *
     * @param action
     */
    Autodesk.Comments2.EditActionManager.prototype.execute = function(action) {

        var redoStack = this.redoStack;
        redoStack.splice(0, redoStack.length);

        action.redo();

        var group = this.getEditActionGroup();
        if (group.isOpen()) {
            group.addAction(action);
        } else {
            group.open();
            group.addAction(action);
            group.close();
        }

        var targetId = action.selectOnExecution ? action.targetId : -1;
        this.fireEvent(
            {type: Autodesk.Comments2.EditActionManager.EVENT_HISTORY_CHANGED, data: {action: 'execute', targetId: targetId}});
    };

    Autodesk.Comments2.EditActionManager.prototype.beginActionGroup = function() {

        var undoStack = this.undoStack;
        var undoStackCount = undoStack.length;
        var group = null;

        if (undoStackCount === 0 || undoStack[undoStackCount-1].isClosed()) {

            group = this.getEditActionGroup();
            group.open();
        } else {
            console.warn('Annotations - Undo/Redo - Action edit group already open.');
        }
    };

    Autodesk.Comments2.EditActionManager.prototype.closeActionGroup = function() {

        var undoStack = this.undoStack;
        var undoStackCount = undoStack.length;

        if (undoStackCount === 0) {

            console.warn('Annotations - Undo/Redo - There is no action edit group to close.');
            return;
        }

        var group = undoStack[undoStackCount-1];
        if(!group.close()) {
            console.warn('Annotations - Undo/Redo - Action edit group already closed.');
        }

        if (group.isEmpty()) {
            undoStack.pop();
        }
    };

    Autodesk.Comments2.EditActionManager.prototype.cancelActionGroup = function() {

    };

    Autodesk.Comments2.EditActionManager.prototype.undo = function() {

        var undoStack = this.undoStack;
        var redoStack = this.redoStack;

        if (undoStack.length === 0) {
            return;
        }

        var group = undoStack.pop();
        var targetId = group.undo();

        redoStack.push(group);

        this.fireEvent(
            {type: Autodesk.Comments2.EditActionManager.EVENT_HISTORY_CHANGED, data: {action:'undo', targetId: targetId}});
    };

    Autodesk.Comments2.EditActionManager.prototype.redo = function() {

        var undoStack = this.undoStack;
        var redoStack = this.redoStack;

        if (redoStack.length === 0) {
            return;
        }

        var group = redoStack.pop();
        var targetId = group.redo();

        undoStack.push(group);

        this.fireEvent(
            {type: Autodesk.Comments2.EditActionManager.EVENT_HISTORY_CHANGED, data: {action:'redo', targetId: targetId}});
    };

    Autodesk.Comments2.EditActionManager.prototype.clear = function() {

        this.undoStack.splice(0, this.undoStack.length);
        this.redoStack.splice(0, this.redoStack.length);

        this.fireEvent({type: Autodesk.Comments2.EditActionManager.EVENT_HISTORY_CHANGED, data: {action:'clear', targetId: -1}});
    };

    Autodesk.Comments2.EditActionManager.prototype.isUndoStackEmpty = function() {

        return this.undoStack.length === 0;
    };

    Autodesk.Comments2.EditActionManager.prototype.isRedoStackEmpty = function() {

        return this.redoStack.length === 0;
    };

    /**
     *
     * @param action
     * @private
     */
    Autodesk.Comments2.EditActionManager.prototype.getEditActionGroup = function() {

        var undoStack = this.undoStack;
        var undoStackCount = this.undoStack.length;

        var group = null;

        if (undoStackCount === 0 || undoStack[undoStackCount-1].isClosed()) {
            group = new Autodesk.Comments2.EditActionGroup();
            undoStack.push(group);
        } else {
            group = undoStack[undoStackCount-1];
        }

        return group;
    };
};

Autodesk.Comments2.importAnnotationsSetArrow = function() {

    /**
     *
     * @param editTool
     * @param arrow
     * @param head
     * @param tail
     * @param strokeWidth
     * @param color
     * @constructor
     */
    Autodesk.Comments2.SetArrow = function(editTool, arrow, head, tail, strokeWidth, color) {

        Autodesk.Comments2.EditAction.call(this, editTool, 'SET-ARROW', arrow.id);

        this.newHead = {x: head.x, y: head.y};
        this.newTail = {x: tail.x, y: tail.y};
        this.oldHead = {x: arrow.head.x, y: arrow.head.y};
        this.oldTail = {x: arrow.tail.x, y: arrow.tail.y};
        this.newStrokeWidth = strokeWidth;
        this.oldStrokeWidth = arrow.strokeWidth;
        this.newColor = color;
        this.oldColor = arrow.color;
    };

    Autodesk.Comments2.SetArrow.prototype = Object.create(Autodesk.Comments2.EditAction.prototype);
    Autodesk.Comments2.SetArrow.prototype.constructor = Autodesk.Comments2.SetArrow;

    Autodesk.Comments2.SetArrow.prototype.redo = function() {

        this.applyState(this.targetId, this.newHead, this.newTail, this.newStrokeWidth, this.newColor);
    };

    Autodesk.Comments2.SetArrow.prototype.undo = function() {

        this.applyState(this.targetId, this.oldHead, this.oldTail, this.oldStrokeWidth, this.oldColor);
    };
    Autodesk.Comments2.SetArrow.prototype.merge = function(action) {

        if (this.targetId === action.targetId &&
            this.type === action.type) {

            this.newHead = action.newHead;
            this.newTail = action.newTail;
            this.newStrokeWidth = action.newStrokeWidth;
            this.newColor = action.newColor;
            return true;
        }
        return false;
    };

    /**
     *
     * @private
     */
    Autodesk.Comments2.SetArrow.prototype.applyState = function(targetId, head, tail, strokeWidth, color) {

        var arrow = this.editor.getAnnotation(targetId);
        if(!arrow) {
            return;
        }

        if (arrow.strokeWidth != strokeWidth) {
            arrow.setStrokeWidth(strokeWidth);
        }
        if (arrow.strokeColor !== color) {
            arrow.setColor(color);
        }

        // Different stroke widths make positions differ at sub-pixel level.
        if (Math.abs(arrow.head.x - head.x) >= 1 || Math.abs(arrow.head.y - head.y) >= 1 ||
            Math.abs(arrow.tail.x - tail.x) >= 1 || Math.abs(arrow.tail.y - tail.y) >= 1) {

            arrow.set(head.x, head.y, tail.x, tail.y);
        }
    };

    /**
     * @returns {boolean}
     */
    Autodesk.Comments2.SetArrow.prototype.isIdentity = function() {

        var identity =
            this.newHead.x === this.oldHead.x &&
            this.newHead.y === this.oldHead.y &&
            this.newTail.x === this.oldTail.x &&
            this.newTail.y === this.oldTail.y &&
            this.newStrokeWidth === this.oldStrokeWidth &&
            this.newColor === this.oldColor;

        return identity;
    };
};

Autodesk.Comments2.importAnnotationsSetPosition = function() {

    /**
     * Annotation generic action that changes annotations screen positions.
     * @param editTool
     * @param annotation
     * @param position
     * @param addToHistory
     * @constructor
     */
    Autodesk.Comments2.SetPosition = function(editTool, annotation, position) {

        Autodesk.Comments2.EditAction.call(this, editTool, 'SET-POSITION', annotation.id);

        var curPosition = annotation.getClientPosition();

        this.newPosition = {x: position.x, y: position.y};
        this.oldPosition = {x: curPosition.x, y: curPosition.y};
    };

    Autodesk.Comments2.SetPosition.prototype = Object.create(Autodesk.Comments2.EditAction.prototype);
    Autodesk.Comments2.SetPosition.prototype.constructor = Autodesk.Comments2.SetPosition;

    Autodesk.Comments2.SetPosition.prototype.redo = function() {

        var annotation = this.editor.getAnnotation(this.targetId);
        annotation.setClientPosition(this.newPosition.x, this.newPosition.y);
    };

    Autodesk.Comments2.SetPosition.prototype.undo = function() {

        var annotation = this.editor.getAnnotation(this.targetId);
        annotation.setClientPosition(this.oldPosition.x, this.oldPosition.y);
    };

    /**
     *
     * @param action
     * @returns {boolean}
     */
    Autodesk.Comments2.SetPosition.prototype.merge = function(action) {

        if (this.targetId === action.targetId &&
            this.type === action.type) {

            this.newPosition = action.newPosition;
            return true;
        }
        return false;
    };

    /**
     * @returns {boolean}
     */
    Autodesk.Comments2.SetPosition.prototype.isIdentity = function() {

        var newPosition = this.newPosition;
        var oldPosition = this.oldPosition;

        return newPosition.x === oldPosition.x && newPosition.y === oldPosition.y;
    };
};

Autodesk.Comments2.importAnnotationsSetText = function() {

    /**
     *
     * @param editTool
     * @param annotation
     * @param text
     * @param fontHeight
     * @param fontFamily
     * @param color
     * @constructor
     */
    Autodesk.Comments2.SetText = function(editTool, annotation, text, fontHeight, fontFamily, color) {

        Autodesk.Comments2.EditAction.call(this, editTool, 'SET-TEXT', annotation.id);

        this.newText = text;
        this.oldText = annotation.getText();
        this.newFontHeight = fontHeight;
        this.oldFontHeight = annotation.fontHeight;
        this.newFontFamily = fontFamily;
        this.oldFontFamily = annotation.fontFamily;
        this.newColor = color;
        this.oldColor = annotation.color;

    };

    Autodesk.Comments2.SetText.prototype = Object.create(Autodesk.Comments2.EditAction.prototype);
    Autodesk.Comments2.SetText.prototype.constructor = Autodesk.Comments2.SetText;

    Autodesk.Comments2.SetText.prototype.redo = function() {

        var text = this.editor.getAnnotation(this.targetId);
        text && text.set(this.newText, this.newFontHeight, this.newFontFamily, this.newColor);
    };

    Autodesk.Comments2.SetText.prototype.undo = function() {

        var text = this.editor.getAnnotation(this.targetId);
        text && text.set(this.oldText, this.oldFontHeight, this.oldFontFamily, this.oldColor);
    };
};

Autodesk.Comments2.importAnnotationsEditor = function() {

    /**
     * Constructs an AnnotationEditor object. AnnotationEditor is an extension to the viewer that permits the user to draw
     * annotations markups (arrows, rectangles, circles, text, etc.) over the viewer content.
     * @param {Autodesk.Viewing.Viewer} viewer
     * @constructor
     */
    Autodesk.Comments2.AnnotationsEditor = function(viewer) {

        Autodesk.Viewing.Extension.call(this, viewer);

        // Add action manager.
        this.actionManager = new Autodesk.Comments2.EditActionManager( 50 ); // history of 50 actions.
        this.actionManager.addEventListener(Autodesk.Comments2.EditActionManager.EVENT_HISTORY_CHANGED, this.onEditActionHistoryChanged.bind(this));
        this.nextId = 0; // Used to identify annotations by id during an edit session.
        this.guiProps = null;
        this.currentGuiProps = null;

        this.EVENT_LEAVE_EDIT_MODE = "AnnotationsEditor_leave_edit_mode";
        this.EVENT_SELECTION_CHANGED = "AnnotationsEditor_selection_changed";

        this.onCameraChangeBinded = this.onCameraChange.bind(this);
        this.onAnnotationDraggingBinded = this.onAnnotationDragging.bind(this);
        this.onAnnotationSelectedBinded = this.onAnnotationSelected.bind(this);
        this.onAnnotationEnterEditionBinded = this.onAnnotationEnterEdition.bind(this);
        this.onAnnotationCancelEditionBinded = this.onAnnotationCancelEdition.bind(this);
        this.onAnnotationDeleteEditionBinded = this.onAnnotationDeleteEdition.bind(this);
    };

    Autodesk.Comments2.AnnotationsEditor.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
    Autodesk.Comments2.AnnotationsEditor.prototype.constructor = Autodesk.Comments2.AnnotationsEditor;

    /**
     * Initializes the extension and create its needed resources.
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.load = function () {

        // Add edit frame.
        this.container = this.viewer.container;
        this.buttons = [
            {
                class:'EditModeArrow',
                id: 'comments-edit-frame-arrow-button',
                guiPropsId: 'ArrowProps',
                annotationType: Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW,
                button: null
            },
            {
                class:'EditModeText2d',
                id: 'comments-edit-frame-label-button',
                guiPropsId: 'TextProps',
                annotationType: Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT2D,
                button: null
            },
            {
                class:'EditModeRectangle',
                id: 'comments-edit-frame-label-button',
                guiPropsId: 'RectangleProps',
                annotationType: Autodesk.Comments2.Annotation.ANNOTATION_TYPE_RECTANGLE,
                button: null
            }
        ];
        this.onEditModeButtonClickBinded = this.onEditModeButtonClick.bind(this);
        this.onMouseMoveBinded = this.onMouseMove.bind(this);
        this.onMouseUpBinded = this.onMouseUp.bind(this);

        // Add edit frame
        var editFrameParts = Autodesk.Comments2.createEditFrame(this.buttons, this.onEditModeButtonClickBinded);
        this.editFrameButtons = editFrameParts.buttonsDiv;
        this.editFrameDiv = editFrameParts.frameDiv;
        this.editFrameDiv.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.editFrameDiv.addEventListener("click", this.onClick.bind(this));
        this.editFrameDiv.addEventListener("keydown", this.onKeyDown.bind(this));

        // Add toolbar
        this.toolbar = new Autodesk.Viewing.UI.ToolBar('annotations-toolbar');
        this.toolbar.addClass('annotations-toolbar');

        // Add toolbar controls
        var navigationControls = new Autodesk.Viewing.UI.ControlGroup('annotations-toolbar-controls');
        navigationControls.setVisible(true);
        this.toolbar.addControl(navigationControls);
        this.toolbar.navigationControls = navigationControls;

        var panButton = new Autodesk.Viewing.UI.Button('annotations-toolbar-panTool');
        panButton.setToolTip('Pan');
        panButton.setIcon('toolbar-panTool');
        panButton.tool = 'pan';
        panButton.onClick = function(event) {event.buttonInstance = panButton; this.onNavigationButtonClick(event);}.bind(this);
        navigationControls.addControl(panButton);

        var zoomButton = new Autodesk.Viewing.UI.Button('annotations-toolbar-zoomTool');
        zoomButton.setToolTip('Zoom');
        zoomButton.setIcon('toolbar-zoomTool');
        zoomButton.tool = 'dolly';
        zoomButton.onClick = function(event) {event.buttonInstance = zoomButton; this.onNavigationButtonClick(event);}.bind(this);
        navigationControls.addControl(zoomButton);

        this.toolbar.navigationControls.buttons = [panButton, zoomButton];

        // Delete selected annotation button
        var btnDeleteAnnot = document.createElement('button');
        this.btnDeleteAnnotation = btnDeleteAnnot;
        btnDeleteAnnot.textContent = 'Delete'; // TODO: Localize
        btnDeleteAnnot.className = "comments-edit-frame-button-delete";
        btnDeleteAnnot.addEventListener("click", function() {
            this.editMode.delete();
        }.bind(this));
        this.editFrameButtons.appendChild(btnDeleteAnnot);

        //Add undo / redo toolbar.
        this.undoToolbar = Autodesk.Comments2.createUndoToolbar(this.onUndo.bind(this), this.onRedo.bind(this));
        this.editFrameButtons.appendChild(this.undoToolbar);


        this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationChanged.bind(this), false);

        this.ignoreNextMouseUp = false; // used to ignore mouse ups when dragging is canceled due to cursor going outside
                                        // of the window.
        // bounds
        this.bounds = {x:0, y:0, width:0, height:0};

        this.buttonBar = this.editFrameDiv.children[0];
        this.updateBoundsBinded = function() {
            var bounds = this.editFrameDiv.getBoundingClientRect();
            var buttonsHeight = this.buttonBar.offsetHeight;

            var actionBarHeight = 0;
            var actionBarPanel = document.getElementsByClassName('MarkupActionBarPanel MABPanel_Edit');
            if (actionBarPanel.length > 0) {
                actionBarHeight = actionBarPanel[0].clientHeight;
            }

            this.bounds.x = 0;
            this.bounds.y = buttonsHeight;
            this.bounds.width = bounds.width;
            this.bounds.height = bounds.height - buttonsHeight - actionBarHeight;
        }.bind(this);

        // Add overlays listener.
        var onDrawOverlay = function (ctx) {
            this.editMode && this.editMode.onDrawOverlay(ctx);
        }.bind(this);

        this.continuosUpdate = function() {
            this.editMode && this.editMode.update();
            window.requestAnimationFrame(this.continuosUpdate);
        }.bind(this);
        window.requestAnimationFrame(this.continuosUpdate);

        this.annotations.addOverlayGraphicsLayer("edit-tool-overlay", 0, onDrawOverlay);

        // Add layer where annotations will actually live
        var divAnnotations = document.createElement('div');
        this.divDrawAnnotations = divAnnotations;
        this.divDrawAnnotations.id = "annotations-parent-div";
        this.editFrameDiv.insertBefore(divAnnotations, this.editFrameDiv.children[0]);

        // Add layer which will contain UI for altering the selected annotation
        this.toolDiv = document.createElement('div');
        this.toolDiv.id = "annotations-edit-properties-selected";
        this.editFrameDiv.appendChild(this.toolDiv);

        this.propsDiv = document.createElement('div');
        this.propsDiv.className = "annotations-edit-properties-options";
        this.editFrameButtons.appendChild(this.propsDiv);

        //instantiate the edit frame
        this.editFrame = new Autodesk.Comments2.EditFrame(this.container, this);

        return true;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.beginActionGroup = function() {

        this.actionManager.beginActionGroup();
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.closeActionGroup = function() {

        this.actionManager.closeActionGroup();
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.cancelActionGroup = function() {

        this.actionManager.cancelActionGroup();
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.setCurrentProps = function(guiPropsId) {

        if (this.currentGuiProps) {

            this.currentGuiProps.exitActiveState();
            this.currentGuiProps = null;
        }

        var nextTool = this.guiProps[guiPropsId];
        if (nextTool) {

            nextTool.enterActiveState(this.viewer, this.propsDiv);
            this.currentGuiProps = nextTool;
            this.editMode && this.editMode.setProps(nextTool.getCurrentValues());
        }
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.handleKeyDown = function(event) {

        if (event.keyCode === Autodesk.Viewing.theHotkeyManager.KEYCODES.ESCAPE) {

            this.cancelEditMode();
            this.viewer.fireEvent({ type:this.EVENT_LEAVE_EDIT_MODE, target:this });
        }
    };

    /**
     * Dispose resources created by this extension and remove event listeners.
     * @returns {boolean} True if unloading was successful
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.unload = function () {

        // Remove event listeners.
        if (this.editFrameDiv.parentNode) {
            this.editFrameDiv.parentNode.removeChild(this.editFrameDiv);
        }

        // Remove overlay layer from markers extension.
        if (this.annotations) {
            this.annotations.removeOverlayGraphicsLayer("edit-tool-overlay");
        }

        return true;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.saveMetadata = function() {

        this.annotations.saveMetadata();
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.getDivAnnotations = function() {

        return this.divDrawAnnotations;
    };

    /**
     * Enters edit mode.
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.enterEditMode = function() {

        // Return if there is no viewer nor model or already in edit mode.
        if (!this.viewer || !this.viewer.model || this.editMode) {
            return;
        }

        this.exitViewMode();

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
        this.viewer.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onCameraChangeBinded);

        // Add edit frame div at the top of all extensions and tools, all user interaction with the viewer is suspended
        // until user selects a point.
        this.container.appendChild(this.editFrameDiv);

        // Bounds.
        this.updateBoundsBinded();
        window.addEventListener("resize", this.updateBoundsBinded);
        document.addEventListener('mousemove', this.onMouseMoveBinded, true);
        document.addEventListener('mouseup', this.onMouseUpBinded, true);

        this.handleKeyDownBinded = this.handleKeyDown.bind(this);
        window.addEventListener("keydown", this.handleKeyDownBinded, false);

        this.hideLmvUi();

        // Clear edit actions history.
        this.actionManager.clear();

        // Add listeners to annotations
        this.annotations.enterEditMode(this.divDrawAnnotations);

        var annotations = this.annotations.getAnnotations();
        var annotationsCount = annotations.length;

        for(var i = 0; i < annotationsCount; ++i) {

            var annotation = annotations[i];

            annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_SELECTED, this.onAnnotationSelectedBinded);
            annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_ENTER_EDITION, this.onAnnotationEnterEditionBinded);
            annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_CANCEL_EDITION, this.onAnnotationCancelEditionBinded);
            annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DELETE_EDITION, this.onAnnotationDeleteEditionBinded);
        }

        if (!this.guiProps) {
            this.initializeGuiProps();
        }

        this.onEditModeButtonClick(this.buttons[0]);

        return true;
    };

    /**
     * @private
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.initializeGuiProps = function() {

        this.guiProps = {};
        var panel;
        var that = this;

        // Arrow
        panel = new Autodesk.Comments2.Gui.ArrowProps();
        panel.addEventListener(panel.EVENT_ON_CHANGE, function(event) {
            that.editMode.setProps(event.data);
        });
        this.guiProps[panel.PROPS_ID] = panel;

        // Text
        panel = new Autodesk.Comments2.Gui.TextProps();
        panel.addEventListener(panel.EVENT_ON_CHANGE, function(event) {
            that.editMode.setProps(event.data);
        });
        this.guiProps[panel.PROPS_ID] = panel;

        // Arrow
        panel = new Autodesk.Comments2.Gui.RectangleProps();
        panel.addEventListener(panel.EVENT_ON_CHANGE, function(event) {
            that.editMode.setProps(event.data);
        });
        this.guiProps[panel.PROPS_ID] = panel;
    };

    /**
     * Leave edit mode.
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.leaveEditMode = function() {

        // Return if not in edit mode.
        if (!this.editMode) {
            return false;
        }

        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChangeBinded);
        this.viewer.removeEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onCameraChangeBinded);

        this.annotations.leaveEditMode();

        // Bounds.
        window.removeEventListener("resize", this.updateBoundsBinded);

        // Remove edit frame div so input can be processed again by viewer and its tools and panels.
        this.editFrameDiv.parentNode.removeChild(this.editFrameDiv);

        window.removeEventListener("keydown", this.handleKeyDownBinded);
        document.removeEventListener("mousemove", this.onMouseMoveBinded, true); // 3rd param is the same as
        document.removeEventListener("mouseup", this.onMouseUpBinded, true);     // when adding the event.

        this.handleKeyDownBinded = null;

        this.restoreLmvUi();

        this.editMode.destroy();
        this.editMode = null;

        this.annotations.leaveEditMode();
        this.annotations.update();
        return true;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.hideLmvUi = function() {

        // exit other tools and hide HudMessages
        this.viewer.setActiveNavigationTool();
        Autodesk.Viewing.Private.HudMessage.dismiss();

        Autodesk.Comments2.hidePanels(true, this.viewer);
        Autodesk.Comments2.hideToolsAndPanels(this.viewer);

        // Shows annotations toolbar.
        if (this.viewer.model.is2d()) {
            this.viewer.container.appendChild(this.toolbar.container);
        }
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.restoreLmvUi = function() {

        Autodesk.Comments2.hidePanels(false, this.viewer);
        Autodesk.Comments2.showToolsAndPanels(this.viewer);

        // Hide annotations toolbar.
        if (this.viewer.model.is2d()) {
            this.viewer.container.removeChild(this.toolbar.container);
        }
    };

    /**
     * Leave edit mode and restores prior pintool to enter edit mode.
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.cancelEditMode = function() {

        // Return if not in edit mode.
        if (!this.leaveEditMode()) {
            return false;
        }

        this.clear();
        return true;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.enterViewMode = function() {
        if (!this.viewer || !this.viewer.model || this.viewMode) {
            return false;
        }
        this.cancelEditMode();

        this.viewMode = true;
        this.hideLmvUi();
        return true;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.exitViewMode = function() {
        if (!this.viewMode) {
            return false;
        }

        this.viewMode = false;
        this.restoreLmvUi();
        this.annotations.exitViewMode();
        return true;
    };

    /**
     *
     * @param modeClassName
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.switchEditMode = function(modeClassName) {

        var mode = this.editMode;

        mode && mode.destroy();
        mode = new Autodesk.Comments2[modeClassName](this.viewer, this);
        mode.className = modeClassName;
        this.editMode = mode;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.allowNavigation = function(allow) {

        this.navigating = allow;
        if (allow){

            this.editFrameDiv.classList.remove("comments-edit-frame-edition");
            this.editFrameDiv.classList.add("comments-edit-frame-navigation");
        } else {

            this.editFrameDiv.classList.remove("comments-edit-frame-navigation");
            this.editFrameDiv.classList.add("comments-edit-frame-edition");
        }
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.getId = function() {

        return ++this.nextId;
    };

    /**
     *
     * @param id
     * @returns {Autodes.Comments.Annotation}
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.getAnnotation = function(id) {

        var annotations = this.annotations.getAnnotations();
        var annotationsCount = annotations.length;

        for(var i = 0; i < annotationsCount; ++i) {
            if (annotations[i].id == id) {
                return annotations[i];
            }
        }

        return null;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.addAnnotation = function(annotation) {

        annotation.setParent(this.divDrawAnnotations);
        annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_SELECTED, this.onAnnotationSelectedBinded);
        annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DRAGGING, this.onAnnotationDraggingBinded);
        annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_ENTER_EDITION, this.onAnnotationEnterEditionBinded);
        annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_CANCEL_EDITION, this.onAnnotationCancelEditionBinded);
        annotation.addEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DELETE_EDITION, this.onAnnotationDeleteEditionBinded);

        this.annotations.addAnnotation(annotation);
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.removeAnnotation = function(annotation) {

        annotation.setParent(null);
        annotation.removeEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_SELECTED, this.onAnnotationSelectedBinded);
        annotation.removeEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DRAGGING, this.onAnnotationDraggingBinded);
        annotation.removeEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_ENTER_EDITION, this.onAnnotationEnterEditionBinded);
        annotation.removeEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_CANCEL_EDITION, this.onAnnotationCancelEditionBinded);
        annotation.removeEventListener(Autodesk.Comments2.Annotation.EVENT_ANNOTATION_DELETE_EDITION, this.onAnnotationDeleteEditionBinded);

        this.annotations.removeAnnotation(annotation);
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.clear = function() {
        
        var annotations = this.annotations.getAnnotations();
        while(annotations.length > 0) {

            var annotation = annotations[0];
            this.annotations.removeAnnotation(annotation);
            annotation.destroy();
        }

        this.annotations.update();
    };

    /**
     * @param {string} [toolId]
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.selectNavigationButton = function(toolId) {

        var buttons = this.toolbar.navigationControls.buttons;
        var buttonsCount = buttons.length;

        for(var i = 0; i < buttonsCount; ++i) {
            var button = buttons[i];

            if (button.tool === toolId) {
                button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
            } else {
                button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
            }
        }
    };

    /**
     * {object} [button]
     * @param button
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.selectAnnotation = function(annotation) {

        if (annotation) {

            var editMode = this.editMode;
            var annotationType = annotation.type;

            if (editMode.type === annotationType) {
                editMode.setSelection(annotation);
            } else {

                var buttons = this.buttons;
                var buttonsCount = this.buttons.length;

                for(var i = 0; i < buttonsCount; ++i) {

                    if (annotationType === buttons[i].annotationType) {
                        this.onEditModeButtonClick(buttons[i]);
                        this.editMode.setSelection(annotation);
                        break;
                    }
                }
            }

            if (this.currentGuiProps) {
                this.currentGuiProps.setFromAnnotation(annotation);
            }
        } else {
            this.editMode.setSelection(null);
        }
    };

    /**
     * {object} [button]
     * @param button
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.selectAnnotationButton = function(button) {

        var buttons = this.buttons;
        var buttonsCount = buttons.length;

        for( var i = 0; i < buttonsCount; ++i ) {
            var b = buttons[i].button;
            if( b === button) {
                b.classList.add("comments-edit-frame-button-active");
                this.switchEditMode(buttons[i].class);
            } else {
                b.classList.remove("comments-edit-frame-button-active");
            }
        }
    };

    /**
     *
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.getBounds = function () {
        return this.bounds;
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.onAnnotationSelected = function(event) {

        this.selectAnnotation(event.annotation);
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onCameraChange = function(event) {

        var annotations = this.annotations.getAnnotations();
        var annotationsCount = annotations.length;

        for(var i = 0; i < annotationsCount; ++i) {
            annotations[i].onCameraChange(event);
        }
        var selectedAnnotation = this.editMode.getSelection();
        this.editFrame.setAnnotation(selectedAnnotation);
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onAnnotationDragging = function(event) {

        if (event.dragging) {
            this.editMode.startDragging();
        } else {
            this.editMode.finishDragging();
        }
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onAnnotationEnterEdition = function(event) {
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onAnnotationCancelEdition = function(event) {

        this.editMode.unselect();
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onAnnotationDeleteEdition = function(event) {

        this.annotations.removeAnnotation(event.annotation);
        this.editMode.delete();
    };

    /**
     * Handler to mouse move events, used to create markups.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.onMouseMove = function(event) {

        if(this.navigating) {
            return;
        }

        if (this.editFrame.isDragging() || this.editFrame.isResizing()) {
            // this.editMode.editFrame.onMouseMove(event);
            // console.log('edit frame has mouse control');
            this.editFrame.onMouseMove(event);
            return;
        }

        event.stopPropagation();
        var mousePosition = Autodesk.Comments2.getMousePosition(event, this.editFrameDiv);

        this.canvasX = mousePosition.x;
        this.canvasY = mousePosition.y;

        this.editMode && this.editMode.onMouseMove(event);
    };

    /**
     * Handler to mouse down events, used to start creation markups.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.onMouseDown = function(event) {

        if (this.navigating) {
            return;
        }

        this.processMouseEvent(event) && this.editMode.onMouseDown(event);

        // TODO: There is a better way to do this, implement when undo/redo group.
        if(!this.editMode.creating && event.target === this.editFrameDiv) {
            this.selectAnnotation(null);
        }
        this.ignoreNextMouseUp = false;
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onMouseUp = function(event) {

        if(this.navigating) {
            return;
        }
        if (this.editFrame.isDragging() || this.editFrame.isResizing()) {
            this.editFrame.onMouseUp(event);
            return;
        }

        this.processMouseEvent(event);
        if (!this.ignoreNextMouseUp) {
            this.editMode.onMouseUp(event);
        }
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onClick = function(event) {

        this.processMouseEvent(event) && !this.ignoreNextMouseUp && this.editMode.onClick(event);
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onUndo = function() {

        this.actionManager.undo();
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onRedo = function() {

        this.actionManager.redo();
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.processMouseEvent = function(event) {

        var mousePosition = Autodesk.Comments2.getMousePosition(event, this.editFrameDiv);

        this.canvasX = mousePosition.x;
        this.canvasY = mousePosition.y;

        var bounds = this.getBounds();
        return mousePosition.x >= bounds.x && mousePosition.x <= bounds.x + bounds.width &&
               mousePosition.y >= bounds.y && mousePosition.y <= bounds.y + bounds.height;
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.onKeyDown = function(event) {
    };

    /**
     *
     * @param buttonData
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.onEditModeButtonClick = function(buttonData) {

        this.selectAnnotationButton(buttonData.button);
        this.setCurrentProps(buttonData.guiPropsId);
        this.selectNavigationButton();
        this.allowNavigation(false);
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.onNavigationButtonClick = function(event) {

        var button = event.buttonInstance;
        var state = button.getState();

        if (state === Autodesk.Viewing.UI.Button.State.INACTIVE) {

            button.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
            this.selectNavigationButton(button.tool);
            this.selectAnnotationButton();
            this.allowNavigation(true);
            this.viewer.setActiveNavigationTool(button.tool);
        } else if (state === Autodesk.Viewing.UI.Button.State.ACTIVE) {

            button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
            this.selectNavigationButton();
            this.allowNavigation(false);
            this.viewer.setActiveNavigationTool();

            // Restore annotation edit mode button state.
            if (this.editMode) {

                var annotationsButtons = this.buttons;
                var annotationsButtonsCount = annotationsButtons.length;

                for(var i = 0; i < annotationsButtonsCount; ++i) {
                    if (annotationsButtons[i].className = this.editMode.className){
                        this.selectAnnotationButton(annotationsButtons[i].button);
                        break;
                    }
                }
            }
        }

        this.editMode && this.editMode.unselect();
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.onNavigationChanged = function(event) {
    };

    Autodesk.Comments2.AnnotationsEditor.prototype.onEditActionHistoryChanged = function(event) {

        this.undoToolbar.undoButton.disabled = this.actionManager.isUndoStackEmpty();
        this.undoToolbar.redoButton.disabled = this.actionManager.isRedoStackEmpty();

        var data = event.data;
        var keepSelection = this.editMode && this.editMode.selectedAnnotation && this.editMode.selectedAnnotation.id === data.targetId;

        if ((data.action !== 'undo' && data.targetId !== -1) ||
             data.action === 'undo' && keepSelection) {

            // Annotation can be null when deleting, that's ok, we unselect in that case.
            var annotation = this.getAnnotation(data.targetId);
            this.selectAnnotation(annotation);
        }
    };

    /**
     * Returns markers extension.
     * @private
     */
    Autodesk.Comments2.AnnotationsEditor.prototype.__defineGetter__('annotations', function () {

        return this.viewer.loadedExtensions['Autodesk.Comments2.Annotations'];
    } );

    Autodesk.Comments2.importAnnotationsRectangle();

    Autodesk.Comments2.importAnnotationsEditMode();
    Autodesk.Comments2.importAnnotationsEditModeArrow();
    Autodesk.Comments2.importAnnotationsEditModeText2d();
    Autodesk.Comments2.importAnnotationsEditModeRectangle();
    Autodesk.Comments2.importAnnotationsEditAction();
    Autodesk.Comments2.importAnnotationsEditActionGroup();
    Autodesk.Comments2.importAnnotationsEditActionManager();
    Autodesk.Comments2.importAnnotationsEditFrame();
    Autodesk.Comments2.importAnnotationsSetPosition();
    Autodesk.Comments2.importAnnotationsCreateArrow();
    Autodesk.Comments2.importAnnotationsDeleteArrow();
    Autodesk.Comments2.importAnnotationsSetArrow();
    Autodesk.Comments2.importAnnotationsCreateText();
    Autodesk.Comments2.importAnnotationsDeleteText();
    Autodesk.Comments2.importAnnotationsSetText();

    /**
     * Register the extension with the extension manager.
     * @private
     */
    Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Comments2.AnnotationsEditor', Autodesk.Comments2.AnnotationsEditor);


}// Autodesk.Comments2.importAnnotationsEditor
namespaceFunction('Autodesk.Viewing.Extensions.Markers');
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsEditMode = function() {

    /**
     * Base object for all Annotation Edit Modes.
     * @constructor
     */
    Autodesk.Comments2.EditMode = function (viewer) {

        this.viewer = viewer;
        this.type = 0;
        this.selectedAnnotation = null;
        this.dragging = false;
        this.draggingAnnotationIniPosition = null;
        this.draggingMouseIniPosition = new THREE.Vector2();
        this.creating = false;
        this.editProps = null;
    };

    Autodesk.Comments2.EditMode.prototype.destroy = function() {
    };

    Autodesk.Comments2.EditMode.prototype.update = function(event) {
    };

    Autodesk.Comments2.EditMode.prototype.setProps = function(props) {

        this.editProps = props;
    };

    Autodesk.Comments2.EditMode.prototype.setSelection = function(annotation) {

        if (this.selectedAnnotation != annotation) {
            this.unselect();
            annotation && annotation.select();
        }

        this.selectedAnnotation = annotation;

        if (!this.creating) {
            this.editTool.editFrame.setAnnotation(annotation);
        }
    };

    Autodesk.Comments2.EditMode.prototype.getSelection = function() {

        return this.selectedAnnotation;
    };

    Autodesk.Comments2.EditMode.prototype.unselect = function() {

        this.editTool.editFrame.setAnnotation(null);
    };

    Autodesk.Comments2.EditMode.prototype.delete = function () {
    };

    Autodesk.Comments2.EditMode.prototype.onDrawOverlay = function (ctx) {
    };

    Autodesk.Comments2.EditMode.prototype.onMouseDown = function (event) {
    };

    Autodesk.Comments2.EditMode.prototype.onMouseUp = function (event) {

        this.finishDragging();
    };

    Autodesk.Comments2.EditMode.prototype.onMouseOut = function (event) {
    };

    Autodesk.Comments2.EditMode.prototype.onMouseMove = function (event) {
    };

    Autodesk.Comments2.EditMode.prototype.onClick = function (event) {
    };

    Autodesk.Comments2.EditMode.prototype.onDoubleClick = function (event) {
    };

    Autodesk.Comments2.EditMode.prototype.onKeyDown = function (event) {
    };

    Autodesk.Comments2.EditMode.prototype.onKeyUp = function (event) {

        event.stopPropagation();
        switch (event.keyCode) {

            case Autodesk.Viewing.theHotkeyManager.KEYCODES.DELETE:
                var selectedAnnotation = this.selectedAnnotation;
                if (!selectedAnnotation.editing) {
                    this.removeAnnotation(selectedAnnotation);
                    this.unselect();
                }
                break;

            case Autodesk.Viewing.theHotkeyManager.KEYCODES.ESCAPE:
                this.unselect();
                break;
        }
    };

    /**
     * @private
     */
    Autodesk.Comments2.EditMode.prototype.startDragging = function() {

        var annotation = this.selectedAnnotation;
        if (annotation) {
            this.dragging = true;
            this.draggingAnnotationIniPosition = annotation.getClientPosition();
            this.draggingMouseIniPosition.set(this.editTool.canvasX, this.editTool.canvasY);
        }
    };

    /**
     * @private
     */
    Autodesk.Comments2.EditMode.prototype.finishDragging = function() {

        var dragging = this.dragging;
        var annotation = this.selectedAnnotation;

        this.dragging = false;

        if (annotation && dragging) {

            var iniPositionX = this.draggingAnnotationIniPosition.x;
            var iniPositionY = this.draggingAnnotationIniPosition.y;
            var endPosition = annotation.getClientPosition();

            if (iniPositionX === endPosition.x &&
                iniPositionY === endPosition.y) {
                return;
            }

            var position = this.getDraggingPosition();
            var setPosition = new Autodesk.Comments2.SePosition(this.editTool, annotation, position, true);

            // We are dragging, so we override the undo location with the initial dragging position.
            setPosition.oldPosition.x = iniPositionX;
            setPosition.oldPosition.y = iniPositionY;

            setPosition.execute();
            annotation.finishDragging();
        }
    };

    /**
     *
     * @returns {{x: *, y: *}}
     */
    Autodesk.Comments2.EditMode.prototype.getDraggingPosition = function () {

        var dx = this.editTool.canvasX - this.draggingMouseIniPosition.x;
        var dy = this.editTool.canvasY - this.draggingMouseIniPosition.y;

        return {
            x: this.draggingAnnotationIniPosition.x + dx,
            y: this.draggingAnnotationIniPosition.y + dy
        };
    };

    /**
     *
     * @param x
     * @param y
     * @param bounds
     * @returns {boolean}
     * @orivate
     */
    Autodesk.Comments2.EditMode.prototype.isInsideBounds = function (x, y, bounds) {

        return x >= bounds.x && x <= bounds.x + bounds.width &&
               y >= bounds.y && y <= bounds.y + bounds.height;
    };
};
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsEditModeArrow = function() {

    /**
     *
     * @param viewer
     * @returns {Autodesk.Comments2.AnnotationArrow}
     * @constructor
     */
    Autodesk.Comments2.AnnotationArrow = function(id, viewer, strokeWidth, color) {

        Autodesk.Comments2.Annotation.call(this, id, viewer);

        this.type = Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW;
        this.constraintHeight = true;

        // Create head and tail.
        this.head = new THREE.Vector3();
        this.tail = new THREE.Vector3();

        this.color = color;

        this.guiPropsId = "ArrowProps";
        this.strokeWidth = strokeWidth;
        this.div = this.createSVG(strokeWidth);

        // Sets creation state.
        this.selected = false;
        this.div.children[0].classList.add("comments-annotation-arrow-creation");

        return this;
    };

    Autodesk.Comments2.AnnotationArrow.prototype = Object.create(Autodesk.Comments2.Annotation.prototype);
    Autodesk.Comments2.AnnotationArrow.prototype.constructor = Autodesk.Comments2.AnnotationArrow;

    Autodesk.Comments2.AnnotationArrow.MIN_ARROWS_WITDH = 50;

    Autodesk.Comments2.AnnotationArrow.prototype.createSVG = function(strokeWidth) {

        this.clientStrokeWidth = Autodesk.Comments2.getClientStrokeWidth(strokeWidth, this.viewer);
        strokeWidth = this.clientStrokeWidth;

        // Create arrow head polygon.
        var arrowSide = strokeWidth * 2;

        var t0x = 0;
        var t0y = strokeWidth;

        var t1x = t0x + Math.cos(30 * (Math.PI / 180)) * arrowSide;
        var t1y = t0y + Math.sin(30 * (Math.PI / 180)) * arrowSide;

        var t2x = t1x;
        var t2y = t0y - Math.sin(30 * (Math.PI / 180)) * arrowSide;

        var t3x = t0x;
        var t3y = t0y;

        var polygon = "'" + t1x + "," + t1y + " " + t2x + "," + t2y + " " + t3x + "," + t3y + "'";

        var div = document.createElement('div');
        div.style.top = "0";
        div.style.left = "0";
        div.style.position = 'absolute';
        div.setAttribute("xmlns", document.documentElement.namespaceURI);
        div.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="' + arrowSide + 'px" tabindex="0" style="position:absolute;left:0;top:0;display:inline-block">' +
                '<polygon xmlns="http://www.w3.org/2000/svg" version="1.1" points=' + polygon + ' style="fill:' + this.color + ';" />' +
                '<line xmlns="http://www.w3.org/2000/svg" version="1.1" x1="' + strokeWidth + '" y1="' + strokeWidth + '" x2="85" y2="' + strokeWidth + '" style="stroke:' + this.color + ';stroke-width:' + strokeWidth + ';" />' +
            '</svg>';
        div.addEventListener("click", function(event) { event.stopPropagation(); }.bind(this), true );
        div.addEventListener("mousedown", this.onMouseDown.bind(this), true );
        div.addEventListener("keydown", this.onKeyDown.bind(this), true );

        div.children[0].classList.add("comments-annotation-arrow");
        this.height = arrowSide;

        div.children[0].addEventListener("mouseout", function(){this.hightlight(false);}.bind(this));
        div.children[0].addEventListener("mouseover", function(){this.hightlight(true);}.bind(this));

        return div;
    };

    Autodesk.Comments2.AnnotationArrow.prototype.set = function(xO, yO, xF, yF) {

        var v1 = new THREE.Vector2(-xF + xO, -yF + yO).normalize();
        var v2 = new THREE.Vector2(1, 0);

        this.angle = Math.acos(v1.dot(v2)) * (v1.y > v2.y ? 1 : -1);

        var aw = Math.sqrt(Math.pow(xF - xO, 2) + Math.pow(yF - yO, 2));
        aw = Math.max( Autodesk.Comments2.AnnotationArrow.MIN_ARROWS_WITDH, aw );

        var head = this.head;
        var tail = this.tail;

        head.set(xO, yO, 0);
        tail.set(xF, yF, 0);

        var direction = tail.clone().sub(head).normalize();
        tail.set(xO + direction.x * aw, yO + direction.y * aw, 0);

        var ox = aw;
        var oy = this.height * 0.5;

        var m1 = new THREE.Matrix4().makeTranslation(-ox, -oy, 0);
        var m2 = new THREE.Matrix4().makeRotationZ(this.angle);
        var m3 = new THREE.Matrix4().makeTranslation(xO, yO, 0);
        var ma = m3.multiply(m2).multiply(m1);
        this.transform = ma;

        this.length = aw;
        this.updateStyle(this.transform, this.color);
        var svg = this.div.children[0];
        Autodesk.Comments2.getSVGChild(svg, 1).setAttribute('x2', aw);

        this.head3dPosition = Autodesk.Comments2.clientToWorld(head.x, head.y, 0, this.viewer);
        this.tail3dPosition = Autodesk.Comments2.clientToWorld(tail.x, tail.y, 0, this.viewer);

        this.clientPosition.x = tail.x + (head.x - tail.x) * 0.5;
        this.clientPosition.y = tail.y + (head.y - tail.y) * 0.5;

        this.clientWidth = Math.round(this.head.clone().sub(this.tail).length());
        this.clientHeight = Math.round(this.clientStrokeWidth * 2);
    };

    Autodesk.Comments2.AnnotationArrow.prototype.rescale = function() {

        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        var length = head.clone().sub(tail).length();
        var scale = length / this.length;

        var ox = this.length * scale;
        var oy = this.height * 0.5 * scale;

        var m0 = new THREE.Matrix4().makeScale(scale, scale, 1);
        var m1 = new THREE.Matrix4().makeTranslation(-ox, -oy, 0);
        var m2 = new THREE.Matrix4().makeRotationZ(this.angle);
        var m3 = new THREE.Matrix4().makeTranslation(head.x, head.y, 0);
        var ma = m3.multiply(m2).multiply(m1).multiply(m0);
        this.transform = ma;

        this.updateStyle(this.transform, this.color);
        var svg = this.div.children[0];
        Autodesk.Comments2.getSVGChild(svg, 1).setAttribute('x2', this.length);

        // Force svg redraw.
        var parent = this.div.parentNode;
        parent.removeChild(this.div);
        parent.appendChild(this.div);

        this.head.copy(head);
        this.tail.copy(tail);

        this.clientPosition.x = tail.x + (head.x - tail.x) * 0.5;
        this.clientPosition.y = tail.y + (head.y - tail.y) * 0.5;

        this.clientWidth = Math.round(this.head.clone().sub(this.tail).length());
        this.clientHeight = Math.round(this.clientStrokeWidth * 2);
    };

    /**
     *
     * @param transform
     * @param {String} color
     */
    Autodesk.Comments2.AnnotationArrow.prototype.updateStyle = function(transform, color) {

        var me = transform.elements;
        var ma = ['matrix(', me[0], ',', me[1], ',', me[4], ',', me[5], ',', me[12], ',', me[13], ')'].join('');

        var svg = this.div.children[0];
        var svgPolygon = Autodesk.Comments2.getSVGChild(svg, 0);
        var svgLine = Autodesk.Comments2.getSVGChild(svg, 1);

        var transform =
            'transform:' + ma + '; transform-origin: 0 0;' +
            '-ms-transform:' + ma + '; -ms-transform-origin: 0 0;' +
            '-webkit-transform: ' + ma + '; -webkit-transform-origin: 0 0;' +
            '-moz-transform: ' + ma + '; -moz-transform-origin: 0 0;' +
            '-o-transform: ' + ma + ';-o-transform-origin: 0 0;';

        svg.setAttribute("style", 'width:' + this.length + 'px; ' + transform + ' position:absolute; display:block');
        svgPolygon.setAttribute("style", 'fill:' + color + ';');
        svgLine.setAttribute("style", 'stroke:' + color + '; stroke-width:' + this.clientStrokeWidth + ';');
    };

    /**
     *
     * @param parent
     */
    Autodesk.Comments2.AnnotationArrow.prototype.setParent = function(parent) {

        var div = this.div;

        div.parentNode && div.parentNode.removeChild(div);
        parent && parent.appendChild(div);
    };

    /**
     *
     * @param x
     * @param y
     */
    Autodesk.Comments2.AnnotationArrow.prototype.setClientPosition = function(x,y) {

        var viewer = this.viewer;
        var clientPosition = this.clientPosition;

        clientPosition.x = x;
        clientPosition.y = y;

        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, viewer);

        var dx = head.x - tail.x;
        var dy = head.y - tail.y;

        var xo = x - dx * 0.5;
        var yo = y - dy * 0.5;

        this.tail3dPosition = Autodesk.Comments2.clientToWorld(xo, yo, 0, viewer);
        this.head3dPosition = Autodesk.Comments2.clientToWorld(xo + dx, yo + dy, 0, viewer);

        this.rescale();
    };

    Autodesk.Comments2.AnnotationArrow.prototype.setStrokeWidth = function(width) {

        this.strokeWidth = width;

        // Remove previous arrow and create a new one, append it to the same parent as the old arrow.
        var parent = this.div.parentNode;
        this.setParent(null);
        this.div = this.createSVG(width);
        this.setParent(parent);

        // Force selected state to recently created divs.
        if (this.selected) {
            this.selected = false;
            this.select();
        }

        // Restore arrow lenght and position.
        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        this.set(head.x, head.y, tail.x, tail.y);
    };

    Autodesk.Comments2.AnnotationArrow.prototype.setColor = function(color) {
        this.color = color;
        this.updateStyle(this.transform, color);
    };

    Autodesk.Comments2.AnnotationArrow.prototype.created = function() {

        this.div.children[0].classList.remove("comments-annotation-arrow-creation");

        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        this.length = head.clone().sub(tail).length();
    };

    Autodesk.Comments2.AnnotationArrow.prototype.destroy = function() {

        this.unselect();
        this.setParent(null);
    };

    Autodesk.Comments2.AnnotationArrow.prototype.initFromMetadata = function (metadata) {

        this.readMetadata(metadata);
        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);
        this.setStrokeWidth(this.strokeWidth);
        this.set(head.x, head.y, tail.x, tail.y);
    };

    Autodesk.Comments2.AnnotationArrow.prototype.select = function() {

        if (this.selected) {
            return;
        }
        this.selected = true;
        Autodesk.Comments2.Annotation.prototype.select.call(this);
    };

    Autodesk.Comments2.AnnotationArrow.prototype.unselect = function() {

        if (!this.selected) {
            return;
        }

        this.selected = false;
        this.div.children[0].blur();

        Autodesk.Comments2.Annotation.prototype.unselect.call(this);
    };

    /**
     *
     * @param highlight
     */
    Autodesk.Comments2.AnnotationArrow.prototype.hightlight = function(highlight) {

        var color = highlight ? 'yellow' : this.color;
        this.updateStyle(this.transform, color);
    };

    /**
     *
     * @param bounds
     */
    Autodesk.Comments2.AnnotationArrow.prototype.constrainsToBounds = function(bounds) {

        // Create arrow bounding box.
        var head = Autodesk.Comments2.worldToClient(this.head3dPosition, this.viewer);
        var tail = Autodesk.Comments2.worldToClient(this.tail3dPosition, this.viewer);

        var arrowWidth = Math.ceil(head.clone().sub(tail).length()+1);
        var arrowHeight = this.height;

        var bboxPoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(arrowWidth, 0, 0),
            new THREE.Vector3(arrowWidth,arrowHeight, 0),
            new THREE.Vector3(0, arrowHeight, 0)
        ];

        // Transform bounding box to client space.
        var bboxPointsCount = bboxPoints.length;
        for(var i = 0; i < bboxPointsCount; ++i) {
            bboxPoints[i].applyMatrix4(this.transform);
        }

        // Calculate new bounding box that fits the transformed one.
        var bboxL = Number.MAX_VALUE;
        var bboxT = Number.MAX_VALUE;
        var bboxR = Number.MIN_VALUE;
        var bboxB = Number.MIN_VALUE;

        for(var i = 0; i < bboxPointsCount; ++i) {

            var point = bboxPoints[i];

            bboxL = Math.min(bboxL, point.x);
            bboxT = Math.min(bboxT, point.y);
            bboxR = Math.max(bboxR, point.x);
            bboxB = Math.max(bboxB, point.y);
        }

        // Calculate how much the arrow has to move to fit in working area.
        var dx = 0;
        var dy = 0;

        var x = Math.max(bounds.x, bboxL);
        var y = Math.max(bounds.y, bboxT);

        if (x != bboxL) {
            dx = x - bboxL;
        } else {
            x = Math.min(bounds.x + bounds.width , bboxR);
            dx = x - bboxR;
        }

        if (y != bboxT) {
            dy = y - bboxT;
        } else {
            y = Math.min(bounds.y + bounds.height, bboxB);
            dy = y - bboxB
        }

        // Constrain position if needed.
        if (dx != 0 || dy != 0) {
            var position = this.getClientPosition();
            this.setClientPosition(position.x + Math.round(dx), position.y + Math.round(dy));
        }
    };

    Autodesk.Comments2.AnnotationArrow.prototype.saveMetadata = function() {

        function toString(vector) {
            return "x=" + vector.x + ",y=" + vector.y + ",z=" + vector.z;
        }

        var metadata = [
            "type:", Autodesk.Comments2.Annotation.getTypeString(this.type),
            "; head:", toString(this.head3dPosition),
            "; tail:", toString(this.tail3dPosition),
            "; strokeWidth:", this.strokeWidth.toString(),
            "; length:", this.length.toString()
        ].join('');

        this.div.setAttribute('metadata', metadata);
    };

    Autodesk.Comments2.AnnotationArrow.prototype.readMetadata = function(metadata) {

        function toVector(string) {
            var values = string.split(",");
            return new THREE.Vector3(
                Number.parseFloat(values[0].split("=")[1]),
                Number.parseFloat(values[1].split("=")[1]),
                Number.parseFloat(values[2].split("=")[1]));
        }

        metadata = metadata.split(';');

        // NOTE: metadata[0] contains type information (already initialized by constructor)
        this.head3dPosition = toVector(metadata[1].split(":")[1]);
        this.tail3dPosition = toVector(metadata[2].split(":")[1]);
        this.strokeWidth = Number.parseFloat(metadata[3].split(":")[1]);
        this.length = Number.parseFloat(metadata[4].split(":")[1]);
    };

    /**
     *
     * @param viewer
     * @param editTool
     * @constructor
     */
    Autodesk.Comments2.EditModeArrow = function(viewer, editTool) {

        Autodesk.Comments2.EditMode.call(this, viewer);
        this.type = Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW;

        // Add members.
        this.editTool = editTool;

        this.annotationId = 0;

        this.initialX = 0;
        this.initialY = 0;

        this.strokeWidth = 1;
        this.color = 'red';
    };

    Autodesk.Comments2.EditModeArrow.prototype = Object.create(Autodesk.Comments2.EditMode.prototype);
    Autodesk.Comments2.EditModeArrow.prototype.constructor = Autodesk.Comments2.EditModeArrow;

    Autodesk.Comments2.EditModeArrow.prototype.destroy = function() {

        this.unselect();
    };

    Autodesk.Comments2.EditModeArrow.prototype.unselect = function() {

        Autodesk.Comments2.EditMode.prototype.unselect.call( this );

        var selectedAnnotation = this.selectedAnnotation;
        if (selectedAnnotation) {
            selectedAnnotation.unselect();
            this.selectedAnnotation = null;
        }
    };

    Autodesk.Comments2.EditModeArrow.prototype.delete = function() {

        var selectedAnnotation = this.selectedAnnotation;
        if (selectedAnnotation) {
            var deleteArrow = new Autodesk.Comments2.DeleteArrow(this.editTool, selectedAnnotation);
            deleteArrow.execute();
        }
    };

    /**
     * Sets multiple text properties at once
     * @param {Object} props
     */
    Autodesk.Comments2.EditModeArrow.prototype.setProps = function (props) {

        Autodesk.Comments2.EditMode.prototype.setProps.call(this, props);

        this.strokeWidth = props.strokeWidth;
        this.color = props.strokeColor;

        var arrow = this.selectedAnnotation;
        if(!arrow) {
            return;
        }

        var setArrow = new Autodesk.Comments2.SetArrow(
            this.editTool,
            arrow,
            arrow.head,
            arrow.tail,
            this.strokeWidth,
            this.color);
        setArrow.execute();
    };

    /**
     * Handler to mouse out events, used to hide gizmo when mouse is not over the tool.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeArrow.prototype.onMouseOut = function(event) {
    };

    /**
     * Handler to mouse move events, used to create markups.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeArrow.prototype.onMouseMove = function(event) {

        Autodesk.Comments2.EditMode.prototype.onMouseMove.call( this, event );

        var annotation = this.selectedAnnotation;
        if(!annotation || !this.creating) {
            return;
        }

        var bounds = this.editTool.getBounds();
        var finalX = Math.min(Math.max(bounds.x, this.editTool.canvasX), bounds.x + bounds.width);
        var finalY = Math.min(Math.max(bounds.y, this.editTool.canvasY), bounds.y + bounds.height);

        if (finalX == this.initialX &&
            finalY == this.initialY) {
            finalX++;
            finalY++;
        }

        var head = {x: this.initialX, y: this.initialY};
        var tail = {x: finalX, y: finalY};

        var setArrow = new Autodesk.Comments2.SetArrow(this.editTool, annotation, head, tail, this.strokeWidth, this.color);
        setArrow.execute();
    };

    /**
     * Handler to mouse down events, used to start annotations creation.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeArrow.prototype.onMouseDown = function(event) {

        Autodesk.Comments2.EditMode.prototype.onMouseDown.call( this, event );

        if (this.selectedAnnotation) {
            return;
        }

        this.initialX = this.editTool.canvasX;
        this.initialY = this.editTool.canvasY;

        // Calculate head and tail.
        var width = Autodesk.Comments2.AnnotationArrow.MIN_ARROWS_WITDH;

        var head = {x: this.initialX, y: this.initialY};
        var tail = {x: Math.round(head.x + Math.cos( Math.PI * 0.25) * width), y: Math.round(head.y + Math.sin(-Math.PI * 0.25) * width)};

        // Constrain head and tail inside working area.
        var constrain = function(head, tail, width, bounds) {

            if (this.isInsideBounds(tail.x, tail.y, bounds)) {
                return;
            }

            tail.y = Math.round(head.y + Math.sin( Math.PI * 0.25) * width);
            if (this.isInsideBounds( tail.x, tail.y, bounds)) {
                return;
            }

            tail.x = Math.round(head.y + Math.cos(-Math.PI * 0.25) * width);
            if (this.isInsideBounds( tail.x, tail.y, bounds)) {
                return;
            }

            tail.y = Math.round(head.y + Math.sin(-Math.PI * 0.25) * width);

        }.bind(this);

        var editor = this.editTool;
        constrain( head, tail, width, editor.getBounds());

        // Create arrow.
        editor.beginActionGroup();

        var arrowId = editor.getId();
        var create = new Autodesk.Comments2.CreateArrow(editor, arrowId, head, tail, this.strokeWidth, this.color);
        create.execute();

        this.selectedAnnotation = editor.getAnnotation(arrowId);
        this.creating = true;
    };

    /**
     * Handler to mouse up events, used to start annotations creation.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeArrow.prototype.onMouseUp = function(event) {

        Autodesk.Comments2.EditMode.prototype.onMouseUp.call( this, event );

        var selectedAnnotation = this.selectedAnnotation;
        if (selectedAnnotation && this.creating) {

            selectedAnnotation.created();
            this.creating = false;

            // Opened on mouse down.
            this.editTool.closeActionGroup();
        }
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.EditModeArrow.prototype.onClick = function(event) {

    };

    /**
     *
     * @param annotation
     */
    Autodesk.Comments2.EditModeArrow.prototype.onAnnotationSelected = function(annotation) {
    };

} // Autodesk.Comments2.importAnnotationsEditModeArrow
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsEditModeRectangle = function() {

    /**
     *
     * @param viewer
     * @param editTool
     * @constructor
     */
    Autodesk.Comments2.EditModeRectangle = function(viewer, editTool) {

        Autodesk.Comments2.EditMode.call(this, viewer);
        this.type = Autodesk.Comments2.Annotation.ANNOTATION_TYPE_RECTANGLE;

        // Add members.
        this.editTool = editTool;

        this.annotationId = 0;

        this.initialX = 0;
        this.initialY = 0;

        this.strokeWidth = 1;
        this.color = 'red';
    };

    Autodesk.Comments2.EditModeRectangle.prototype = Object.create(Autodesk.Comments2.EditMode.prototype);
    Autodesk.Comments2.EditModeRectangle.prototype.constructor = Autodesk.Comments2.EditModeRectangle;

    Autodesk.Comments2.EditModeRectangle.prototype.destroy = function() {

        this.unselect();
    };

    Autodesk.Comments2.EditModeRectangle.prototype.unselect = function() {

        Autodesk.Comments2.EditMode.prototype.unselect.call( this );

        var selectedAnnotation = this.selectedAnnotation;
        if (selectedAnnotation) {
            selectedAnnotation.unselect();
            this.selectedAnnotation = null;
        }
    };

    Autodesk.Comments2.EditModeRectangle.prototype.delete = function() {

        var selectedAnnotation = this.selectedAnnotation;
        if (selectedAnnotation) {
            var deleteArrow = new Autodesk.Comments2.DeleteArrow(this.editTool, selectedAnnotation);
            deleteArrow.execute();
        }
    };

    /**
     * Sets multiple text properties at once
     * @param {Object} props
     */
    Autodesk.Comments2.EditModeRectangle.prototype.setProps = function (props) {

        Autodesk.Comments2.EditMode.prototype.setProps.call(this, props);

        this.strokeWidth = props.strokeWidth;
        this.color = props.strokeColor;

        var arrow = this.selectedAnnotation;
        if(!arrow) {
            return;
        }

        var setArrow = new Autodesk.Comments2.SetArrow(
            this.editTool,
            arrow,
            arrow.head,
            arrow.tail,
            this.strokeWidth,
            this.color);
        setArrow.execute();
    };

    /**
     * Handler to mouse out events, used to hide gizmo when mouse is not over the tool.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeRectangle.prototype.onMouseOut = function(event) {
    };

    /**
     * Handler to mouse move events, used to create markups.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeRectangle.prototype.onMouseMove = function(event) {

        Autodesk.Comments2.EditMode.prototype.onMouseMove.call( this, event );

        var annotation = this.selectedAnnotation;
        if(!annotation || !this.creating) {
            return;
        }

        var bounds = this.editTool.getBounds();
        var finalX = Math.min(Math.max(bounds.x, this.editTool.canvasX), bounds.x + bounds.width);
        var finalY = Math.min(Math.max(bounds.y, this.editTool.canvasY), bounds.y + bounds.height);

        if (finalX == this.initialX &&
            finalY == this.initialY) {
            finalX++;
            finalY++;
        }

        var head = {x: this.initialX, y: this.initialY};
        var tail = {x: finalX, y: finalY};

        var setArrow = new Autodesk.Comments2.SetArrow(this.editTool, annotation, head, tail, this.strokeWidth, this.color);
        setArrow.execute();
    };

    /**
     * Handler to mouse down events, used to start annotations creation.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeRectangle.prototype.onMouseDown = function(event) {

        Autodesk.Comments2.EditMode.prototype.onMouseDown.call( this, event );

        if (this.selectedAnnotation) {
            return;
        }

        this.initialX = this.editTool.canvasX;
        this.initialY = this.editTool.canvasY;

        // Calculate head and tail.
        var width = Autodesk.Comments2.AnnotationArrow.MIN_ARROWS_WITDH;

        var head = {x: this.initialX, y: this.initialY};
        var tail = {x: Math.round(head.x + Math.cos( Math.PI * 0.25) * width), y: Math.round(head.y + Math.sin(-Math.PI * 0.25) * width)};

        // Constrain head and tail inside working area.
        var constrain = function(head, tail, width, bounds) {

            if (this.isInsideBounds(tail.x, tail.y, bounds)) {
                return;
            }

            tail.y = Math.round(head.y + Math.sin( Math.PI * 0.25) * width);
            if (this.isInsideBounds( tail.x, tail.y, bounds)) {
                return;
            }

            tail.x = Math.round(head.y + Math.cos(-Math.PI * 0.25) * width);
            if (this.isInsideBounds( tail.x, tail.y, bounds)) {
                return;
            }

            tail.y = Math.round(head.y + Math.sin(-Math.PI * 0.25) * width);

        }.bind(this);

        var editor = this.editTool;
        constrain( head, tail, width, editor.getBounds());

        // Create arrow.
        editor.beginActionGroup();

        var arrowId = editor.getId();
        var create = new Autodesk.Comments2.CreateArrow(editor, arrowId, head, tail, this.strokeWidth, this.color);
        create.execute();

        this.selectedAnnotation = editor.getAnnotation(arrowId);
        this.creating = true;
    };

    /**
     * Handler to mouse up events, used to start annotations creation.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Comments2.EditModeRectangle.prototype.onMouseUp = function(event) {

        Autodesk.Comments2.EditMode.prototype.onMouseUp.call( this, event );

        var selectedAnnotation = this.selectedAnnotation;
        if (selectedAnnotation && this.creating) {

            selectedAnnotation.created();
            this.creating = false;

            // Opened on mouse down.
            this.editTool.closeActionGroup();
        }
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.EditModeRectangle.prototype.onClick = function(event) {

    };

    /**
     *
     * @param annotation
     */
    Autodesk.Comments2.EditModeRectangle.prototype.onAnnotationSelected = function(annotation) {
    };

} // Autodesk.Comments2.importAnnotationsEditModeRectangle
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importAnnotationsEditModeText2d = function() {

    /**
     * Arrow Annotation.
     * @constructor
     */
    Autodesk.Comments2.AnnotationText2d = function(id, viewer, text, width, height, fontHeight, fontFamily, color) {

        Autodesk.Comments2.Annotation.call(this, id, viewer);

        this.constraintRotation = true;
        this.clientWidth = width;
        this.clientHeight = height;

        this.type = Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT2D;
        this.position = new THREE.Vector3(0,0,0);

        this.wrapper = document.createElement("div");
        this.wrapper.className = "comments-annotation-textarea-2d-wrapper";

        this.background = document.createElement("div");
        this.foreground = document.createElement("div");
        this.foreground.spellcheck = false;
        this.placeholder = "write something...";
        this.selected = false;
        this.editing = false;
        this.previousText = "";
        this.color = color;
        this.fontFamily = fontFamily;

        var background = this.background;
        background.id = "background";
        background.className = "comments-annotation-textarea-2d";
        background.innerText = this.placeholder;
        background.tabIndex = "0";
        background.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        background.setAttribute("version", "1.1");

        var foreground = this.foreground;
        foreground.id = "foreground";
        foreground.className = "comments-annotation-textarea-2d";
        foreground.innerText = "";
        foreground.tabIndex = "0";
        foreground.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        foreground.setAttribute("version", "1.1");

        this.wrapper.appendChild(background);
        this.wrapper.appendChild(foreground);

        this.guiPropsId = "TextProps";
        this.fontHeight = fontHeight;

        this.setText(text);
        this.updateStyle(this.clientPosition, fontHeight, fontFamily, this.color);

        this.onClick = function(event) {
            event.stopPropagation();
            this.select();
        }.bind(this);

        this.onDoubleClick = function(event) {
            event.stopPropagation();
            this.edit();
        }.bind(this);

        background.addEventListener("click", function(e) {e.stopPropagation();}, true);
        foreground.addEventListener("click", function(e) {e.stopPropagation();}, true);
        background.addEventListener("mousedown", this.onMouseDown.bind(this), true);
        foreground.addEventListener("mousedown", this.onMouseDown.bind(this), true);
        background.addEventListener("mouseup", this.onMouseUp.bind(this), true);
        foreground.addEventListener("mouseup", this.onMouseUp.bind(this), true);
        background.addEventListener("keydown", this.onKeyDown.bind(this), true);
        foreground.addEventListener("keydown", this.onKeyDown.bind(this), true);

        foreground.addEventListener("mouseout", function(){this.hightlight(false);}.bind(this));
        foreground.addEventListener("mouseover", function(){this.hightlight(true);}.bind(this));
    };

    Autodesk.Comments2.AnnotationText2d.prototype = Object.create(Autodesk.Comments2.Annotation.prototype);
    Autodesk.Comments2.AnnotationText2d.prototype.constructor = Autodesk.Comments2.AnnotationText2d;

    Autodesk.Comments2.AnnotationText2d.prototype.destroy = function() {

        this.unselect();
        this.setParent(null);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.set = function(text, fontHeight, fontFamily, color) {

        this.updateStyle(this.clientPosition, fontHeight, fontFamily, color);
        this.setText(text);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.initFromMetadata = function (metadataString) {

        this.readMetadata(metadataString);

        this.updateStyle(this.clientPosition, this.fontHeight, this.fontFamily, this.color);
        this.update();
    };

    Autodesk.Comments2.AnnotationText2d.prototype.update = function() {

        if (this.foreground.innerText === "") {
            this.background.innerText = this.placeholder;
        } else {
            this.background.innerText = "";
        }
    };

    Autodesk.Comments2.AnnotationText2d.prototype.setClientPosition = function(x, y) {

        this.clientPosition.x = x;
        this.clientPosition.y = y;

        this.updateStyle(this.clientPosition, this.fontHeight, this.fontFamily, this.color);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.setParent = function(parent) {

        var wrapper = this.wrapper;
        var currentParent = wrapper.parentNode;

        if (currentParent){

            currentParent.removeChild(wrapper);
        }

        if (parent) {

            parent.appendChild(wrapper);
        }
    };

    Autodesk.Comments2.AnnotationText2d.prototype.setText = function(text) {

        this.foreground.innerText = text;
        this.update();
    };

    Autodesk.Comments2.AnnotationText2d.prototype.setTextFromDiv = function(divNode) {

        var theText = divNode.firstChild.data;
        this.setText(theText);
        this.background.style.display = "none";
    };

    Autodesk.Comments2.AnnotationText2d.prototype.getText = function() {

        return this.foreground.innerText;
    };

    Autodesk.Comments2.AnnotationText2d.prototype.select = function() {

        if (this.selected) {
            return;
        }
        this.previousText = this.getText();
        this.selected = true;
        this.wrapper.classList.add("comments-annotation-textarea-2d-selected");
        this.focus();

        Autodesk.Comments2.Annotation.prototype.select.call(this);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.unselect = function() {

        if (!this.selected) {
            return;
        }
        this.selected = false;
        this.editing = false;

        this.wrapper.classList.remove("comments-annotation-textarea-2d-selected");
        this.foreground.classList.remove("comments-annotation-textarea-2d-edit");
        this.blur();
    };

    Autodesk.Comments2.AnnotationText2d.prototype.edit = function() {

        this.previousText = this.getText();
        this.selected = true;
        this.editing = true;
        this.wrapper.classList.add("comments-annotation-textarea-2d-selected");
        this.foreground.classList.add("comments-annotation-textarea-2d-edit");
        this.focus();
        this.hightlight(false);

        Autodesk.Comments2.Annotation.prototype.edit.call(this);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.cancel = function() {

        this.setText(this.previousText);

        if (this.getText() == '') {
            this.delete();
        } else {
            this.unselect();
        }

        Autodesk.Comments2.Annotation.prototype.cancel.call(this);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.focus = function() {

        // sets the text cursor at the end of the div.
        this.createCaretPlacer = function(el) {
            if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        };
        var f = function() { this.foreground.focus(); this.createCaretPlacer(this.foreground);}.bind(this);
        setTimeout(f, 10);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.blur = function() {

        this.background.className = "comments-annotation-textarea-2d";
        var f = function() {this.foreground.blur();}.bind(this);
        setTimeout(f, 10);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.hightlight = function(highlight) {

        this.hightlighted = highlight;
        this.updateStyle(this.clientPosition, this.fontHeight, this.fontFamily, this.color);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.constrainsToBounds = function(bounds) {

        var size = this.background.getBoundingClientRect();
        var position = this.getClientPosition();

        var x = Math.min(bounds.x + bounds.width - size.width, Math.max(bounds.x, position.x));
        var y = Math.min(bounds.y + bounds.height - size.height, Math.max(bounds.y, position.y));

        if (x != position.x || y != position.y) {
            this.setClientPosition(x, y);
        }
    };

    Autodesk.Comments2.AnnotationText2d.prototype.rescale = function() {

        this.updateStyle(this.clientPosition, this.fontHeight, this.fontFamily, this.color);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.updateStyle = function(position, fontHeight, fontFamily, color) {

        this.clientPosition.x = position.x;
        this.clientPosition.y = position.y;

        this.fontHeight = fontHeight;
        this.fontFamily = fontFamily;
        this.color = color;

        color = (this.hightlighted && !this.editing) ? 'yellow' : color;
        this.position = Autodesk.Comments2.clientToWorld(position.x, position.y, 0, this.viewer);

        var ox = this.clientWidth * 0.5;
        var oy = this.clientHeight * 0.5;

        fontHeight = Autodesk.Comments2.getClientFontHeight(fontHeight, this.viewer);

        var ma = new THREE.Matrix4().makeTranslation(Math.floor(position.x - ox), Math.floor(position.y - oy), 0);
        var me = ma.elements;
        ma = ['matrix(', me[0], ',', me[1], ',', me[4], ',', me[5], ',', me[12], ',', me[13], ')'].join('');

        var transform =
            'transform:' + ma + '; transform-origin: 0 0;' +
            '-ms-transform:' + ma + '; -ms-transform-origin: 0 0;' +
            '-webkit-transform: ' + ma + '; -webkit-transform-origin: 0 0;' +
            '-moz-transform: ' + ma + '; -moz-transform-origin: 0 0;' +
            '-o-transform: ' + ma + '; -o-transform-origin: 0 0;';

        var sizeStyle  = "width:" + this.clientWidth + "px; height:" + this.clientHeight + "px; max-width:" + this.clientWidth + "px; max-height:" + this.clientHeight + "px;";
        var constStyle = 'position: relative; border-radius: 0; outline: none; word-wrap: break-word; left: 0; top:0;';
        var transStyle = transform;
        var fontsStyle = 'font-family: ' + fontFamily + ', serif; font-size: ' + fontHeight + 'px; font-style: italic; font-weight: bold; color: ' + color + ';';

        this.wrapper.setAttribute("style", "position: absolute; overflow:hidden; top:0; left:0;" + transStyle + sizeStyle);
        this.foreground.setAttribute("style", constStyle + fontsStyle + sizeStyle);
        this.background.setAttribute("style", fontsStyle + sizeStyle);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.saveMetadata = function() {

        function toString(vector) {
            return "x=" + vector.x + ",y=" + vector.y + ",z=" + vector.z;
        }

        var metadata = [
            "type:", Autodesk.Comments2.Annotation.getTypeString(this.type),
            "; text:" , encodeURI(this.getText()),
            "; position:" , toString(this.clientPosition),
            "; fontHeight:", this.fontHeight.toString()
        ].join('');

        this.foreground.setAttribute('metadata', metadata);
    };

    Autodesk.Comments2.AnnotationText2d.prototype.readMetadata = function(metadata) {

        function toVector(string) {
            var values = string.split(",");
            return new THREE.Vector3(
                Number.parseFloat(values[0].split("=")[1]),
                Number.parseFloat(values[1].split("=")[1]),
                Number.parseFloat(values[2].split("=")[1]));
        }

        metadata = metadata.split(';');

        // NOTE: metadata[0] contains type information (already initialized by constructor)
        this.setText(decodeURI(metadata[1].split(":")[1]));
        this.position = toVector(metadata[2].split(":")[1]);
        this.fontHeight = Number.parseFloat(metadata[3].split(":")[1]);
    };

    /**
     *
     * @param viewer
     * @constructor
     */
    Autodesk.Comments2.EditModeText2d = function(viewer, editTool) {

        Autodesk.Comments2.EditMode.call(this, viewer);
        this.type = Autodesk.Comments2.Annotation.ANNOTATION_TYPE_TEXT2D;

        // Add members.
        this.editTool = editTool;
    };

    Autodesk.Comments2.EditModeText2d.prototype = Object.create(Autodesk.Comments2.EditMode.prototype);
    Autodesk.Comments2.EditModeText2d.prototype.constructor = Autodesk.Comments2.EditModeText2d;

    Autodesk.Comments2.EditModeText2d.prototype.destroy = function() {

        this.unselect();
    };

    Autodesk.Comments2.EditModeText2d.prototype.update = function() {

        var annotation = this.selectedAnnotation;
        if (annotation) {
            annotation.update();

            // TODO: Remove when text is inside a box of fixed size, right now the box grows while typing and if it grows
            // outside of the client area the browser will scroll the parent div no matter what.
            if (annotation.editing) {
                annotation.constrainsToBounds(this.editTool.getBounds());
            }
        }
    };

    Autodesk.Comments2.EditModeText2d.prototype.unselect = function() {

        Autodesk.Comments2.EditMode.prototype.unselect.call( this );

        var selectedAnnotation = this.selectedAnnotation;
        this.selectedAnnotation = null;

        if (!selectedAnnotation) {
            return;
        }

        var editTool = this.editTool;

        // TODO: Find a better way to communicate the annotation's previous text to the undo/redo system.
        var text = selectedAnnotation.getText();
        selectedAnnotation.setText(selectedAnnotation.previousText);

        // Delete annotation if it's text is empty.
        if (text == '') {

            var deleteText = new Autodesk.Comments2.DeleteText(editTool, selectedAnnotation);
            deleteText.addToHistory = !this.firstEdition;
            deleteText.execute();

            return;
        }

        if (this.firstEdition) {

            editTool.removeAnnotation(selectedAnnotation);
            var createText = new Autodesk.Comments2.CreateText(
                editTool,
                selectedAnnotation.id,
                text,
                selectedAnnotation.getClientPosition(),
                selectedAnnotation.getClientWidth(),
                selectedAnnotation.getClientHeight(),
                selectedAnnotation.getFontHeight(),
                selectedAnnotation.fontFamily,
                selectedAnnotation.color
            );
            createText.execute();
        } else {

            if (text != selectedAnnotation.getText()) {

                var setText = new Autodesk.Comments2.SetText(
                    this.editTool,
                    selectedAnnotation,
                    text,
                    this.fontHeight,
                    this.fontFamily,
                    this.color);
                setText.execute();
            }
        }

        selectedAnnotation = editTool.getAnnotation(selectedAnnotation.id);
        selectedAnnotation && selectedAnnotation.unselect();

        this.firstEdition = false;
    };

    Autodesk.Comments2.EditModeText2d.prototype.delete = function() {

        var editTool = this.editTool;
        var selectedAnnotation = this.selectedAnnotation;
        if(!selectedAnnotation) {
            return;
        }

        this.unselect();

        selectedAnnotation = editTool.getAnnotation(selectedAnnotation.id);
        if(!selectedAnnotation) {
            return;
        }

        var deleteText = new Autodesk.Comments2.DeleteText(this.editTool, selectedAnnotation);
        deleteText.execute();
    };


    /**
     * Sets multiple text properties at once
     * @param {Object} props
     */
    Autodesk.Comments2.EditModeText2d.prototype.setProps = function(props) {

        Autodesk.Comments2.EditMode.prototype.setProps.call(this, props);

        this.fontHeight = props.fontSize;
        this.fontFamily = props.fontFamily;
        this.color = props.color;

        var selectedAnnotation = this.selectedAnnotation;
        if(!selectedAnnotation) {
            return;
        }

        if (selectedAnnotation.fontHeight === props.fontSize &&
            selectedAnnotation.fontFamily === props.fontFamily &&
            selectedAnnotation.color === props.color ) {
            return;
        }

        var setText = new Autodesk.Comments2.SetText(
            this.editTool,
            selectedAnnotation,
            selectedAnnotation.getText(),
            props.fontSize,
            props.fontFamily,
            props.color);
        setText.execute();
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.EditModeText2d.prototype.onMouseDown = function(event) {

        if (this.selectedAnnotation) {
            return;
        }

        this.creating = true;
        this.firstEdition = true;

        var editTool = this.editTool;
        var position = {x: editTool.canvasX + 100, y: editTool.canvasY + 25};

        var createText = new Autodesk.Comments2.CreateText(
            editTool, editTool.getId(), "", position, 200, 50, this.fontHeight, this.fontFamily, this.color);
        createText.addToHistory = false;
        createText.execute();

        var selected = editTool.getAnnotation(createText.targetId);
        selected.edit();
        this.setSelection(selected);
    };

    /**
     *
     * @param event
     */
    Autodesk.Comments2.EditModeText2d.prototype.onMouseUp = function(event) {
        this.creating = false;
    };
        /**
     *
     * @param annotation
     */
    Autodesk.Comments2.EditModeText2d.prototype.onAnnotationSelected = function(annotation) {
    };

} //  Autodesk.Comments2.importAnnotationsEditModeText2d
namespaceFunction('Autodesk.Comments2.Gui');

(function(){
// Begin closure

    'use strict';

    // Data //
    var mPanelInst = null;
    var mViewer = null;
    var mCurrentValues = {};
    var mStrokeWidthData = null;

    // Divs //
    var mContainingDiv = null;
    var mStrokeWidthDropDown = null;
    var mColorPicker = null;

    /**
     * UI Component with properties to alter Arrow visuals
     * @constructor
     */
    Autodesk.Comments2.Gui.ArrowProps = function() {

        deInitialize();

        this.EVENT_ON_CHANGE = "EVENT_ANNOTATIONS_GUI_ARROW_TOOLS_CHANGE";
        this.PROPS_ID = "ArrowProps"; // TODO: Use Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW instead

        // Event dispatcher
        Autodesk.Comments2.addTrait_eventDispatcher(this);

        this.enterActiveState = function(viewer, parentDiv) {
            if (!mPanelInst) {
                mPanelInst = this;
                initialize(viewer, parentDiv);
            }
            mContainingDiv.style.display = "block";
        };

        this.exitActiveState = function() {
            if (mPanelInst) {
                mContainingDiv.style.display = "none";
            }
        };

        this.setFromAnnotation = function(annotation) {
            mCurrentValues.strokeWidth = Number(annotation.strokeWidth);
            mCurrentValues.strokeColor = annotation.color;
            refreshValues();
        };

        this.getCurrentValues = function() {
            return mCurrentValues;
        };
    };

    //////////////////////////////
    /// PRIVATE METHODS
    //////////////////////////////

    function initialize(viewer, parentDiv) {
        mViewer = viewer;
        mStrokeWidthData = generateStrokeWidthData();
        mCurrentValues = {
            strokeWidth: mStrokeWidthData[1].value,
            strokeColor: '#FF0000'
        };
        buildUi(parentDiv);
    }

    function deInitialize() {

        if (!mPanelInst){
            return;
        }

        Autodesk.Comments2.remTrait_eventDispatcher(mPanelInst);

        mViewer = null;
        mCurrentValues = {};  // TODO, maybe we would like to keep these values? 
        mStrokeWidthData = null;

        mContainingDiv = null;
        mStrokeWidthDropDown = null;
        mColorPicker = null;

        mPanelInst = null;
    }

    function buildUi(parentDiv) {

        mContainingDiv = document.createElement("div");

        // Add annotations scale combo.
        mStrokeWidthDropDown = Autodesk.Comments2.Gui.Common.createDropDown();
        mContainingDiv.appendChild(mStrokeWidthDropDown);
        mStrokeWidthDropDown.addEventListener("change", function(){
            mCurrentValues.strokeWidth = mStrokeWidthDropDown.value;
            mPanelInst.fireEvent({ type: mPanelInst.EVENT_ON_CHANGE, data: mCurrentValues });
        });

        // Color picker
        mColorPicker = Autodesk.Comments2.Gui.Common.createColorPicker();
        mColorPicker.addEventListener("change", function(event) {
            mCurrentValues.strokeColor = event.currentTarget.value;
            mPanelInst.fireEvent({ type: mPanelInst.EVENT_ON_CHANGE, data: mCurrentValues });
        });
        mContainingDiv.appendChild(mColorPicker);

        refreshValues();
        parentDiv.appendChild(mContainingDiv);
    }

    function refreshValues() {
        Autodesk.Comments2.Gui.Common.refreshDropDown(
            mStrokeWidthDropDown, mStrokeWidthData, mCurrentValues.strokeWidth
        );
        mColorPicker.value = mCurrentValues.strokeColor;
    }

    /**
     * Calculates values for Stroke Width DropDown
     * @returns {Array}
     */
    function generateStrokeWidthData() {

        var smallWidth;
        var data = mViewer.model.getData();
        if (data.is2d) {
            smallWidth = Autodesk.Comments2.metersToModel(0.0254, mViewer) * 2; // 0.0254 m == 1 inch
        } else {
            smallWidth = 0.005;
        }

        // TODO: Localize
        return [
            {tag:"Thin", value: smallWidth},
            {tag:"Normal", value: smallWidth * 3},
            {tag:"Thick", value: smallWidth * 9}
        ];
    }

// End closure
}());

namespaceFunction('Autodesk.Comments2.Gui.Common');

Autodesk.Comments2.Gui.Common.refreshDropDown = function(dropDown, dataSource, defaultValue) {

    while(dropDown.children.length) {
        dropDown.removeChild(dropDown.children[0]);
    }

    var valuesCount = dataSource.length;
    for(var i = 0; i < valuesCount; ++i) {

        var value = dataSource[i];
        var option = document.createElement("option");

        option.className = "comments-edit-frame-drop-down-option";
        option.value = value.value;
        option.innerHTML = value.tag;
        option.selected = (defaultValue === value.value);
        dropDown.appendChild(option);
    }
};

/**
 * Standard dropDown
 * @returns {Element}
 */
Autodesk.Comments2.Gui.Common.createDropDown = function() {
    var elem = document.createElement("select");
    elem.className = "comments-edit-frame-drop-down";
    return elem;
};

/**
 * Creates an HTML-5 color picker
 */
Autodesk.Comments2.Gui.Common.createColorPicker = function() {

    var elem = document.createElement('input');
    elem.className = "co2-annotations-color-picker";
    elem.setAttribute('type', 'color');
    return elem;
};

namespaceFunction('Autodesk.Comments2.Gui');

(function(){
// Begin closure

    'use strict';

    // Data //
    var mPanelInst = null;
    var mViewer = null;
    var mCurrentValues = {};
    var mStrokeWidthData = null;

    // Divs //
    var mContainingDiv = null;
    var mStrokeWidthDropDown = null;
    var mColorPicker = null;

    /**
     * UI Component with properties to alter Rectangle visuals
     * @constructor
     */
    Autodesk.Comments2.Gui.RectangleProps = function() {

        deInitialize();

        this.EVENT_ON_CHANGE = "EVENT_ANNOTATIONS_GUI_ARROW_TOOLS_CHANGE";
        this.PROPS_ID = "RectangleProps"; // TODO: Use Autodesk.Comments2.Annotation.ANNOTATION_TYPE_ARROW instead

        // Event dispatcher
        Autodesk.Comments2.addTrait_eventDispatcher(this);

        this.enterActiveState = function(viewer, parentDiv) {
            if (!mPanelInst) {
                mPanelInst = this;
                initialize(viewer, parentDiv);
            }
            mContainingDiv.style.display = "block";
        };

        this.exitActiveState = function() {
            if (mPanelInst) {
                mContainingDiv.style.display = "none";
            }
        };

        this.setFromAnnotation = function(annotation) {
            mCurrentValues.strokeWidth = Number(annotation.strokeWidth);
            mCurrentValues.strokeColor = annotation.color;
            refreshValues();
        };

        this.getCurrentValues = function() {
            return mCurrentValues;
        };
    };

    //////////////////////////////
    /// PRIVATE METHODS
    //////////////////////////////

    function initialize(viewer, parentDiv) {
        mViewer = viewer;
        mStrokeWidthData = generateStrokeWidthData();
        mCurrentValues = {
            strokeWidth: mStrokeWidthData[1].value,
            strokeColor: '#FF0000'
        };
        buildUi(parentDiv);
    }

    function deInitialize() {

        if (!mPanelInst){
            return;
        }

        Autodesk.Comments2.remTrait_eventDispatcher(mPanelInst);

        mViewer = null;
        mCurrentValues = {};  // TODO, maybe we would like to keep these values? 
        mStrokeWidthData = null;

        mContainingDiv = null;
        mStrokeWidthDropDown = null;
        mColorPicker = null;

        mPanelInst = null;
    }

    function buildUi(parentDiv) {

        mContainingDiv = document.createElement("div");

        // Add annotations scale combo.
        mStrokeWidthDropDown = Autodesk.Comments2.Gui.Common.createDropDown();
        mContainingDiv.appendChild(mStrokeWidthDropDown);
        mStrokeWidthDropDown.addEventListener("change", function(){
            mCurrentValues.strokeWidth = mStrokeWidthDropDown.value;
            mPanelInst.fireEvent({ type: mPanelInst.EVENT_ON_CHANGE, data: mCurrentValues });
        });

        // Color picker
        mColorPicker = Autodesk.Comments2.Gui.Common.createColorPicker();
        mColorPicker.addEventListener("change", function(event) {
            mCurrentValues.strokeColor = event.currentTarget.value;
            mPanelInst.fireEvent({ type: mPanelInst.EVENT_ON_CHANGE, data: mCurrentValues });
        });
        mContainingDiv.appendChild(mColorPicker);

        refreshValues();
        parentDiv.appendChild(mContainingDiv);
    }

    function refreshValues() {
        Autodesk.Comments2.Gui.Common.refreshDropDown(
            mStrokeWidthDropDown, mStrokeWidthData, mCurrentValues.strokeWidth
        );
        mColorPicker.value = mCurrentValues.strokeColor;
    }

    /**
     * Calculates values for Stroke Width DropDown
     * @returns {Array}
     */
    function generateStrokeWidthData() {

        var smallWidth;
        var data = mViewer.model.getData();
        if (data.is2d) {
            smallWidth = Autodesk.Comments2.metersToModel(0.0254, mViewer) * 2; // 0.0254 m == 1 inch
        } else {
            smallWidth = 0.005;
        }

        // TODO: Localize
        return [
            {tag:"Thin", value: smallWidth},
            {tag:"Normal", value: smallWidth * 3},
            {tag:"Thick", value: smallWidth * 9}
        ];
    }

// End closure
}());

namespaceFunction('Autodesk.Comments2.Gui');

(function(){
// Begin closure

    'use strict';

    // Data //
    var mPanelInst = null,
        mViewer = null,
        mCurrentValues = {},
        mFontSizeData = null,
        mFontFamilyData = null;

    // Divs //
    var mContainingDiv = null,
        mFontSizeDropDown = null,
        mColorPicker = null,
        mFontFamilyDropDown = null;

    /**
     * UI Component with properties to alter Text/Label visuals
     * @constructor
     */
    Autodesk.Comments2.Gui.TextProps = function() {

        deInitialize();

        this.EVENT_ON_CHANGE = "EVENT_ANNOTATIONS_GUI_TEXT_TOOLS_CHANGE";
        this.PROPS_ID = "TextProps";

        // Event dispatcher
        Autodesk.Comments2.addTrait_eventDispatcher(this);

        this.enterActiveState = function(viewer, parentDiv) {
            if (!mPanelInst) {
                mPanelInst = this;
                initialize(viewer, parentDiv);
            }
            mContainingDiv.style.display = "block";
        };

        this.exitActiveState = function() {
            if (mPanelInst) {
                mContainingDiv.style.display = "none";
            }
        };

        this.setFromAnnotation = function(annotation) {
            mCurrentValues.fontSize = Number(annotation.fontHeight);
            mCurrentValues.fontFamily = annotation.fontFamily;
            mCurrentValues.color = annotation.color;
            refreshValues();
        };

        this.getCurrentValues = function() {
            return mCurrentValues;
        };
    };

    //////////////////////////////
    /// PRIVATE METHODS
    //////////////////////////////

    function initialize(viewer, parentDiv) {
        mViewer = viewer;
        mFontSizeData = generateFontSizeData();
        mFontFamilyData = generateFontFamilyData();
        mCurrentValues = {
            fontSize: mFontSizeData[1].value,
            fontFamily: mFontFamilyData[0].value,
            color: '#FF4EAA'
        };
        buildUi(parentDiv);
    }

    function deInitialize() {

        if (!mPanelInst){
            return;
        }

        Autodesk.Comments2.remTrait_eventDispatcher(mPanelInst);

        mViewer = null;
        mCurrentValues = {}; // TODO, maybe we would like to keep these values?
        mFontSizeData = null;
        mFontFamilyData = null;

        mContainingDiv = null;
        mFontSizeDropDown = null;
        mColorPicker = null;
        mFontFamilyDropDown = null;

        mPanelInst = null;
    }

    function buildUi(parentDiv) {

        mContainingDiv = document.createElement("div");

        // Font size DropDown
        mFontSizeDropDown = Autodesk.Comments2.Gui.Common.createDropDown();
        mContainingDiv.appendChild(mFontSizeDropDown);
        mFontSizeDropDown.addEventListener("change", function(){
            mCurrentValues.fontSize = mFontSizeDropDown.value;
            mPanelInst.fireEvent({ type: mPanelInst.EVENT_ON_CHANGE, data: mCurrentValues });
        });

        // Color picker
        mColorPicker = Autodesk.Comments2.Gui.Common.createColorPicker();
        mColorPicker.addEventListener("change", function(event) {
            mCurrentValues.color = event.currentTarget.value;
            mPanelInst.fireEvent({ type: mPanelInst.EVENT_ON_CHANGE, data: mCurrentValues });
        });
        mContainingDiv.appendChild(mColorPicker);

        // Font family DropDown
        mFontFamilyDropDown = Autodesk.Comments2.Gui.Common.createDropDown();
        mFontFamilyDropDown.className += " co2-annotations-textProps-fontFamily-dropDown";
        mContainingDiv.appendChild(mFontFamilyDropDown);
        mFontFamilyDropDown.addEventListener("change", function(){
            mCurrentValues.fontFamily = mFontFamilyDropDown.value;
            mFontFamilyDropDown.style['font-family'] = mCurrentValues.fontFamily;
            mPanelInst.fireEvent({ type: mPanelInst.EVENT_ON_CHANGE, data: mCurrentValues });
        });

        refreshValues();
        parentDiv.appendChild(mContainingDiv);
    }

    function refreshValues() {
        Autodesk.Comments2.Gui.Common.refreshDropDown(
            mFontSizeDropDown, mFontSizeData, mCurrentValues.fontSize
        );
        Autodesk.Comments2.Gui.Common.refreshDropDown(
            mFontFamilyDropDown, mFontFamilyData, mCurrentValues.fontFamily
        );
        // Apply FontFamily to individual entries
        for (var i= 0, len=mFontFamilyDropDown.children.length; i<len; ++i) {
            var entry = mFontFamilyDropDown.children[i];
            entry.style['font-family'] = mFontFamilyData[i].value;
        }
        // Apply FontFamily to the Font DropDown itself
        mFontFamilyDropDown.style['font-family'] = mCurrentValues.fontFamily;
        // Color
        mColorPicker.value = mCurrentValues.color;
    }

    function generateFontSizeData() {

        var smallWidth;
        var data = mViewer.model.getData();
        if (data.is2d) {

            smallWidth = Autodesk.Comments2.metersToModel(0.0254, mViewer) * 5; // 0.0254 m == 1 inch
        } else {

            smallWidth = 0.0125;
        }

        // TODO: Localize
        return [
            {tag:"Small", value: smallWidth},
            {tag:"Medium", value: smallWidth * 3},
            {tag:"Large", value: smallWidth * 9}
        ];
    }

    function generateFontFamilyData() {

        // TODO: Localize?
        // TODO: Validate fonts with design
        // Source: http://www.webdesigndev.com/web-development/16-gorgeous-web-safe-fonts-to-use-with-css
        return [
            {tag:"Arial", value: "Arial"},
            {tag:"Arial Black", value: "Arial Black"},
            {tag:"Verdana", value: "Verdana"},
            {tag:"Impact", value: "Impact"},
            {tag:"Palatino Linotype", value: "Palatino Linotype"},
            {tag:"Tahoma", value: "Tahoma"},
            {tag:"Century Gothic", value: "Century Gothic"},
            {tag:"Lucida Sans Unicode", value: "Lucida Sans Unicode"},
            {tag:"Times New Roman", value: "Times New Roman"},
            {tag:"Arial Narrow", value: "Arial Narrow"},
            {tag:"Copperplate Gothic Light", value: "Copperplate"},
            {tag:"Lucida Console", value: "Lucida Console"},
            {tag:"Trebuchet MS", value: "Trebuchet MS"},
            {tag:"Georgia", value: "Georgia"},
            {tag:"Courier New", value: "Courier New"}
        ];
    }


// End closure
}());

namespaceFunction('Autodesk.Viewing.Extensions.Markers');
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importViewerMarkers = function() {

    /**
     * Constructs a ViewerMarkers object. ViewerMarkers is an extension to viewer that permits add
     * markers over the viewer's canvas. The extension uses a canvas 2d to draw lines over the model's
     * fragments and connect them to html nodes provided to the extension.
     * @param {Autodesk.Viewing.Viewer} viewer
     * @constructor
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers = function (viewer) {

        Autodesk.Viewing.Extension.call(this, viewer);
    }

    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.constructor = Autodesk.Viewing.Extensions.Markers.ViewerMarkers;

    /**
     * Initializes the extension and create its needed resources.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.load = function () {

        // We only support Viewer3D. Bail out early if not.
        if (!(this.viewer instanceof Autodesk.Viewing.Viewer3D)) {
            return false;
        }

        this.markerGroups = [];
        this.modelMarkers = [];
        this.lines = [];

        this.markersVisible = true;
        this.minimumGroupMarkerWidth = 80;

        // Overlays.
        this.overlaysGraphicsLayers = [];

        // Its not possible to composite canvas with children divs, so we add a wrapper for the line canvas
        // and the markers.
        this.markersWrap = document.createElement("div");
        this.markersWrap.id = "markers-wrap";
        this.markersWrap.style.left = 0;
        this.markersWrap.style.top = 0;
        this.markersWrap.style.right = 0;
        this.markersWrap.style.bottom = 0;
        this.markersWrap.style.width = "100%";
        this.markersWrap.style.height = "100%";
        this.markersWrap.style.backgroundColor = "transparent";
        this.markersWrap.style.position = "absolute";

        // Create the canvas where lines will be draw.
        this.markerLines = document.createElement("canvas");
        this.markerLines.id = "markers-lines";
        this.markerLines.style.left = 0;
        this.markerLines.style.top = 0;
        this.markerLines.style.right = 0;
        this.markerLines.style.bottom = 0;
        this.markerLines.style.width = "100%";
        this.markerLines.style.height = "100%";
        this.markerLines.style.backgroundColor = "transparent";
        this.markerLines.style.position = "absolute";

        // Insert the markerWrap as the first child of the viewer container,
        // the lines should no be over other parts of the ui.
        this.container = this.viewer.container;

        if (this.container.firstChild) {
            this.container.insertBefore(this.markersWrap, this.container.firstChild);
        } else {
            this.container.appendChild(this.markersWrap);
        }
        this.markersWrap.appendChild(this.markerLines);

        // Disable mouse event handling to allow the viewer to consume them.
        // The support of pointer-events property is recently added to all mayor browsers.
        this.markersWrap.style.pointerEvents = "none";

        // Create an overlay to highlight geometry associated with markers.
        this.highlightedMeshes = {};
        this.materialBase = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.25, transparent: false });
        this.materialTop = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, opacity: 0.01, shading: THREE.NoShading, transparent: true });

        this.viewer.impl.createOverlayScene("markers", this.materialBase, this.materialTop);

        this.htmlBounds = new THREE.Box2();
        this.viewerBounds = new THREE.Box2();
        this.modelMarkersBoundingBox = new THREE.Box2();
        this.modelMarkersBoundingBox.min.x = -100000; // big negative value to collide with markers pushed outside viewer bounds
        this.modelMarkersBoundingBox.min.y = -100000; // big negative value to collide with markers pushed outside viewer bounds
        this.gizmosColor = "#4078A8";
        this.gizmosBorderColor = "#FFFFFF";
        this.gizmosBorderWidth = 5.3;
        this.gizmosLineWidth = 3;
        this.gizmosCircleRadio = 4;
        this.gizmosCircleBorderRadio = 5.3;

        // Add event listeners.
        this.onCameraChange = function () {
            this.update();
        }.bind(this);

        this.onExplodeChange = function () {
            this.update();
        }.bind(this);

        this.onViewerResize = function () {

            this.clientWidth = this.container.offsetWidth;
            this.clientHeight = this.container.offsetHeight;

            this.viewerBounds.min.x = 0;
            this.viewerBounds.min.y = 0;
            this.viewerBounds.max.x = this.clientWidth;
            this.viewerBounds.max.y = this.clientHeight;

            this.htmlBounds.min.x = this.viewerBounds.min.x + 50;
            this.htmlBounds.min.y = this.viewerBounds.min.y + 50;
            this.htmlBounds.max.x = this.viewerBounds.max.x - 50;
            this.htmlBounds.max.y = this.viewerBounds.max.y - 50;

            // TODO: A better fix would be to update matrices before sending resize event.
            this.viewer.impl.updateCameraMatrices();
            this.update();
        }.bind(this);

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);
        this.viewer.addEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, this.onExplodeChange);
        this.viewer.addEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewerResize);

        this.onViewerResize();
        return true;
    }

    /**
     * Dispose resources created by this extension and remove event listeners.
     * @returns {boolean} True if unloading was successful.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.unload = function () {

        // Remove event listeners.
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onCameraChange);
        this.viewer.removeEventListener(Autodesk.Viewing.EXPLODE_CHANGE_EVENT, this.onExplodeChange);
        this.viewer.removeEventListener(Autodesk.Viewing.VIEWER_RESIZE_EVENT, this.onViewerResize);

        this.markerGroups.splice(0, this.markerGroups.length);
        this.modelMarkers.splice(0, this.markerGroups.length);
        this.lines.splice(0, this.lines.length);

        this.markersWrap.parentNode.removeChild(this.markersWrap);
        this.viewer.impl.removeOverlayScene("markers");

        this.materialBase.dispose();
        this.materialTop.dispose();

        this.overlaysGraphicsLayers = [];

        return true;
    }

    /**
     * Reposition and redraw the graphical elements of this extension; markers, highlights and lines.
     * Should be called when cameras, viewports, highlights, markers, lines or models change.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.update = function () {

        if(!this.visible || !this.viewer.model) {
            return;
        }

        this.markerLines.width  = this.markerLines.clientWidth;
        this.markerLines.height = this.markerLines.clientHeight;

        var ctx = this.markerLines.getContext("2d");
        if (!ctx) {
            return;
        }

        ctx.clearRect(0,0,this.markerLines.width, this.markerLines.height);

        var modelBoundingRectangle = this.getModelBoundingRectangle(this.viewer.model);

        this.updateModelMarkers();
        this.updateMarkerGroups(ctx, modelBoundingRectangle);
        this.drawLines(ctx);
        this.updateOverlayGraphicsLayers(ctx);
    };

    /**
     * Reposition and redraw marker groups. Markers are grouped in clusters based on the model's node they belong.
     * @param {CanvasRenderingContext2D} ctx Context used to draw lines and other shapes associated to markers.
     * @param {THREE.Box2} modelBoundingRectangle Rectangle that fits all the screen projected points of the model's bounding box.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.updateMarkerGroups = function (ctx, modelBoundingRectangle) {

        if (!this.markersVisible || !this.viewer.prefs.showCommentMarkers) {
            return;
        }

        this.updateProxiesCenters();
        this.sortMarkerGroups();

        // Update marker groups positions and resolve their collisions.
        var model = this.viewer.model;
        var modelCenter = this.getModelCenter(model);

        var markerGroups = this.markerGroups;
        var markerGroupCount = markerGroups.length;

        var minX = modelBoundingRectangle.min.x;
        var maxX = modelBoundingRectangle.max.x;

        for (var i = 0; i < markerGroupCount; ++i) {
            this.updateMarkerGroup(markerGroups[i], modelCenter, minX, maxX);
        }
        this.resolveMarkersCollisions(modelCenter, minX, maxX);

        // Draw lines and place html elements.
        for (var i = 0; i < markerGroupCount; ++i) {

            var group = markerGroups[i];

            // Move html elements to markers position.
            var markers = group;
            var markerCount = markers.length;

            if (group.clipped) {

                // If the marker group was clipped, its position is snapped to a side of the viewer.
                // Also, only the first marker of the group is shown.
                var html = markers[0].html;

                html.data.setDirection(!group.flip ? "outside_left" : "outside_right");
                html.style.display = group.visible ? "" : "none";

                if (group.flip) {
                    html.style.left = Math.round(group.x - html.offsetWidth)+ "px";
                    html.style.top = Math.round(group.y - html.offsetHeight * 0.5) + "px";
                } else {
                    html.style.left = Math.round(group.x) + "px";
                    html.style.top = Math.round(group.y - html.offsetHeight * 0.5) + "px";
                }

                for (var j = 1; j < markerCount; ++j) {
                    var html = markers[j].html;
                    html.style.display = "none";
                }
            } else {

                // If the marker group was not clipped, the first marker in the group is placed in the calculated group's
                // position. The following markers are placed next to each other starting from the group's position.
                this.drawLine(ctx, group.proxyCenter.x, group.proxyCenter.y, group.x, group.y);

                var htmlClass = group.flip ? "left" : "right";
                var htmlDirection = group.flip ? 1 : -1;

                for (var j = 0; j < markerCount; ++j) {

                    var html = markers[j].html;

                    html.data.setDirection( j == 0 ? htmlClass : "" );
                    html.style.display = "";

                    var htmlX = group.x - html.offsetWidth * 0.5 + html.offsetWidth * j * htmlDirection;
                    var htmlY = group.y - html.offsetHeight * 0.5;

                    html.style.left = Math.round(htmlX) + "px";
                    html.style.top = Math.round(htmlY) + "px";
                }
            }
        }
    }

    /**
     * Reposition and redraw model markers. Model markers are the ones not linked to a model's node. It's assumed they
     * are associated to all the model and not one of its parts.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.updateModelMarkers = function () {

        var markers = this.modelMarkers;
        var markerCount = markers.length;

        if (markerCount == 0) {
            return;
        }

        var markerPositionX = 10;
        var markerPositionY = 10;
        var markerSeparation = 5;

        if (this.markersVisible && this.viewer.prefs.showCommentMarkers) {

            // If model markers are visible, their html elements are place left to right at the top of the viewer.
            for (var i = 0; i < markerCount; ++i) {

                var marker = markers[i];
                var html = marker.html;

                html.style.display = "";
                html.style.left = markerPositionX + "px";
                html.style.top = markerPositionY + "px";

                markerPositionX += parseInt(html.offsetWidth + markerSeparation);

                this.modelMarkersBoundingBox.max.x = markerPositionX;
                this.modelMarkersBoundingBox.max.y = markerPositionY + html.offsetHeight;
            }
        } else {

            // Hide model markers if they were set as not visible.
            for (var i = 0; i < markerCount; ++i) {

                var html = markers[i].html;
                html.style.display = "none";
            }

            this.modelMarkersBoundingBox.max.x = markerPositionX;
            this.modelMarkersBoundingBox.max.y = markerPositionY;
        }
    }

    /**
     * Reposition and redraw lines. These lines doesn't belong to marker groups, these are the ones that link model's nodes
     * to fixed screen positions (currently they are used to draw lines from comments to model's nodes).
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.drawLines = function (ctx) {

        var viewer = this.viewer;
        var lines = this.lines;
        var lineCount = lines.length;

        for (var i = 0; i < lineCount; ++i) {

            var line = lines[i];

            if (line.fragId != -1) {

                var position = this.getProxyCenter(line.fragId, line.centerOffset);
                this.drawLine(ctx, position.x, position.y, line.x, line.y);
            } else {

                var position = Autodesk.Viewing.Extensions.Markers.worldToClient(line.centerOffset, viewer);
                this.drawLine(ctx, position.x, position.y, line.x, line.y);
            }
        }
    }

    /**
     * Clear all marker groups and model markers.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.clearMarkers = function() {

        var markers, markerCount;

        // Clear marker groups.
        markers = this.markerGroups;
        markerCount = markers.length;

        for (var i = 0; i < markerCount; ++i) {
            this.removeMarker(markers[i].id);
        }

        // Clear model markers.
        markers = this.modelMarkers;
        markerCount = markers.length;

        for (var i = 0; i < markerCount; ++i) {
            this.removeMarker(markers[i].id);
        }

        this.update();
    }

    /**
     * Add a node marker to the viewer. A node marker (also referred just as marker) is an html element attached to a
     * model's node with a line.
     * @param {string} id Id of the marker to add.
     * @param {number} nodeId Id of the model's node the marker will be attached.
     * @param {object} html Html element that will be placed at the extreme of the marker.
     * @param {Vector3} centerOffset Offset in model's space coordinates of the markup's start position from the node's
     * bounding box center.
     * @returns {boolean} True if the marker was added successfully.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.setNodeMarker = function(id, nodeId, html, centerOffset) {

        // If no html element is passed or no fragment id is associated to nodeId with no center offset, the method fails.
        var fragId = this.getFragmentId(nodeId);
        if ((fragId == -1 && !centerOffset) || !html)  {
            return false;
        }

        // Create marker.
        var marker = {
            id: id,
            html: html
        };
        html.style.display = (this.markersVisible && this.viewer.prefs.showCommentMarkers) ? "block" : "none";

        // Create marker group for new marker or add it to an existing group.
        var groupIndex = centerOffset ? -1 : this.getIndexFromId(nodeId, this.markerGroups);
        centerOffset = centerOffset ? centerOffset : new THREE.Vector3(0,0,0);

        if (groupIndex != -1) {

            var markers = this.markerGroups[groupIndex];
            var markerIndex = this.getIndexFromId(id, markers);

            markers.centerOffset = centerOffset;

            if (markerIndex != -1) {

                this.markersWrap.removeChild(markers[markerIndex].html);
                markers.splice(markerIndex, 1, marker);
            } else {
                markers.push(marker);
            }
        } else {

            var markerGroup = [marker];

            markerGroup.id = -1;
            markerGroup.nodeId = nodeId;
            markerGroup.fragId = fragId;
            markerGroup.x = 0;
            markerGroup.y = 0;
            markerGroup.flip = false;
            markerGroup.proxyCenter = new THREE.Vector2();
            markerGroup.htmlOffset = new THREE.Vector2();
            markerGroup.htmlSize = new THREE.Vector2();
            markerGroup.distanceFromCenter = 0;
            markerGroup.wholeBoundingBox = new THREE.Box2();
            markerGroup.htmlBoundingBox = new THREE.Box2();
            markerGroup.centerOffset = centerOffset;

            this.markerGroups.push(markerGroup);
        }

        this.markersWrap.appendChild(marker.html);
        this.update();

        return true;
    }

    /**
     * Add a model marker to the viewer. A model marker is not attached to a node in the model.
     * @param {string} id The id of the marker to add.
     * @param {string} Html element to place as the marker.
     * @returns {boolean} - True if the marker was added successfully.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.setModelMarker = function (id, html) {

        // If no html element is passed, the method fails.
        if(!html)  {
            return false;
        }

        // Create model marker.
        var marker = {
            id: id,
            html: html
        };
        html.style.display = (this.markersVisible && this.viewer.prefs.showCommentMarkers) ? "block" : "none";

        // Add or replace model marker with same id.
        var index = this.getIndexFromId(id, this.modelMarkers);
        if(index != -1) {

            this.markersWrap.removeChild(this.modelMarkers[index].html);
            this.modelMarkers.splice(index, 1, marker);
        } else {

            this.modelMarkers.push(marker);
        }

        this.markersWrap.appendChild(marker.html);
        this.update();

        return true;
    }

    /**
     * Remove a marker from the viewer. It can be used to remove node and model markers.
     * @param {string} id Id of the marker to remove.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.removeMarker = function (id) {

        // Remove node marker from markers groups.
        var markerGroups = this.markerGroups;
        var markerGroupCount = markerGroups.length;

        for (var i = 0; i < markerGroupCount; ++i) {

            var markerGroup = markerGroups[i];
            var markerIndex = this.getIndexFromId(id, markerGroup);

            if (markerIndex != -1) {

                this.markersWrap.removeChild(markerGroup[markerIndex].html);
                markerGroup.splice(markerIndex, 1);

                if (markerGroup.length == 0) {
                    markerGroups.splice(i, 1);
                }
                break;
            }
        }

        // Remove model marker.
        var index = this.getIndexFromId(id, this.modelMarkers);
        if (index != -1) {

            this.markersWrap.removeChild(this.modelMarkers[index].html);
            this.modelMarkers.splice(index, 1);
        }

        this.update();
    }

    /**
     * Add a line segment to the viewer from a model's marker to a fixed screen position.
     * @param {string} id Id of the line to add.
     * @param {number} nodeId Id of model's marker the line will be attached.
     * @param {number} x X-axis position of the end of the line segment in client space coordinates.
     * @param {number} y Y-axis position of the end of the line segment in client space coordinates.
     * @returns {boolean} True if the line was added successfully.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.setLineToMarker = function (id, markerId, x, y) {

        // Get line's node id and center offset.
        var markerNodeId = -1;
        var markerCenterOffset = null;

        var groups = this.markerGroups;
        var groupCount = groups.length;

        for (var i = 0; i < groupCount; ++i) {

            var group = groups[i];
            var markerCount = group.length;

            for (var j = 0; j < markerCount; ++j) {

                var marker = group[j];
                if (marker.id == markerId) {
                    markerNodeId = group.nodeId;
                    markerCenterOffset = group.centerOffset;
                    break;
                }
            }
        }

        if (markerNodeId == -1 && !markerCenterOffset) {
            return false;
        }

        // Create line.
        if (!this.setLine(id, markerNodeId, x, y, markerCenterOffset)) {
            return false;
        }

        this.update();
        return true;
    }

    /**
     * Add a line segment to the viewer from a model's node to a fixed screen position.
     * @param {string} id Id of the line to add.
     * @param {number} nodeId Id of model's node the line will be attached.
     * @param {number} x X-axis position of the end of the line segment in client space coordinates.
     * @param {number} y Y-axis position of the end of the line segment in client space coordinates.
     * @param {THREE.Vector3} [centerOffset] Offset in model's space coordinates of the markup's start position from the node's
     * bounding box center.
     * @returns {boolean} True if the line was added successfully.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.setLine = function (id, nodeId, x, y, centerOffset) {

        // Create line.
        var line = {
            id:id,
            nodeId: nodeId,
            fragId: this.getFragmentId(nodeId),
            x: x,
            y: y,
            centerOffset: centerOffset ? centerOffset.clone() : new THREE.Vector3(0,0,0)
        };

        // Add or replace line with same id.
        var index = this.getIndexFromId(id, this.lines);
        if (index != -1) {
            this.lines.splice(index, 1, line);
        } else {
            this.lines.push(line);
        }

        this.update();
        return true;
    }

    /**
     * Remove a line segment from the viewer.
     * @param {id} Id of the line segment to remove.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.removeLine = function (id) {

        var index = this.getIndexFromId(id, this.lines);
        if(index != -1) {
            this.lines.splice(index, 1);
        }
        this.update();
    }

    /**
     * Returns true if extension elements are visible.
     * @returns {Boolean} True if extension elements are visible.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.__defineGetter__('visible', function () {

        return this.markersWrap.style.display == "block" || this.markersWrap.style.display == "";
    } );

    /**
     * Make all extension elements visible.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.show = function () {

        this.markersWrap.style.display = "block";
        this.update();
    }

    /**
     * Make all extension elements hidden.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.hide = function () {

        this.markersWrap.style.display = "none";
    }

    /**
     * Set visibility for node and model markers; lines and highlights are not affected by this method.
     * @param {boolean} isVisible
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.setMarkersVisible = function(isVisible) {

        if (isVisible == this.markersVisible) {
            return;
        }

        this.markersVisible = isVisible;
        this.updateMarkersVisibility();
        this.update();
    };

    /**
     * Should be called each time marker's visibility changes.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.updateMarkersVisibility = function () {

        var displayType = (this.markersVisible && this.viewer.prefs.showCommentMarkers) ? "block" : "none";
        var markerGroups = this.markerGroups;
        var markerGroupCount = markerGroups.length;

        for (var i = 0; i < markerGroupCount; ++i) {

            var markers = markerGroups[i];
            var markerCount = markers.length;

            for (var j = 0; j < markerCount; ++j) {
                markers[j].html.style.display = displayType;
            }
        }
    };

    /**
     * Returns a fragment id associated to a model's node id.
     * @param {number} nodeId Id of the model's node whose fragment id is required.
     * @returns {number} The first fragment id found or -1 if no fragment was found.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.getFragmentId = function(dbId) {

        return Autodesk.Comments2.LmvUtils.getFragmentId(this.viewer.model, dbId);
    }

    /**
     * Returns the index of the first element in the provided array with the same id passed as
     * parameter.
     * @param {object} id Id of the element whose index is required.
     * @param {array} array Array used to search the element.
     * @returns {number} Index of the element found or -1 if no element was found.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.getIndexFromId = function(id, array) {

        var count = array.length;
        for (var i = 0; i < count; ++i) {
            if (array[i].id == id) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Transform and project into client space coordinates the center of the model's bounding box.
     * @param model Model whose projected center will be calculated.
     * @returns {THREE.Vector3} Model's bounding box center transformed and projected into client coordinates.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.getModelCenter = function (model) {

        var modelCenter = model.getBoundingBox().center();
        return Autodesk.Viewing.Extensions.Markers.worldToClient(modelCenter, this.viewer);
    }

    /**
     * Transform and project into client space coordinates the corners of the model's bounding box, then, calculates and
     * returns a rectangle that fits these points.
     * @param model Model used to calculate its bounding rectangle.
     * @returns {THREE.Box2} Transformed and projected into client coordinates model's bounding box fit rectangle.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.getModelBoundingRectangle = function(model) {

        var min = model.getBoundingBox().min;
        var max = model.getBoundingBox().max;

        var points = [
            new THREE.Vector3(min.x, min.y, min.z),
            new THREE.Vector3(min.x, max.y, min.z),
            new THREE.Vector3(max.x, min.y, min.z),
            new THREE.Vector3(max.x, max.y, min.z),

            new THREE.Vector3(min.x, min.y, max.z),
            new THREE.Vector3(min.x, max.y, max.z),
            new THREE.Vector3(max.x, min.y, max.z),
            new THREE.Vector3(max.x, max.y, max.z),
        ];

        var minX = Number.POSITIVE_INFINITY;
        var minY = Number.POSITIVE_INFINITY;
        var maxX = Number.NEGATIVE_INFINITY;
        var maxY = Number.NEGATIVE_INFINITY;

        var pointCount = points.length;
        for( var i = 0; i < pointCount; ++i) {

            var transformedPoint = Autodesk.Viewing.Extensions.Markers.worldToClient(points[i], this.viewer);

            minX = Math.min(minX, transformedPoint.x);
            minY = Math.min(minY, transformedPoint.y);
            maxX = Math.max(maxX, transformedPoint.x);
            maxY = Math.max(maxY, transformedPoint.y);
        }

        return new THREE.Box2(new THREE.Vector2(minX, minY), new THREE.Vector2(maxX, maxY));
    }

    /**
     * Calculates the bounding box's center in client space coordinates of the fragment with the provided id.
     * The center is offsetted by the offset associated to the group at node marker creating time.
     * @param {number} fragId Id of the fragment whose center is required.
     * @param {THREE.Vector3} [offset] And offset in model space coordinates that can be applied to the calculated proxy's
     * bounding box center.
     * @returns {THREE.Vector3} Bounding box's center transformed and projected into client space
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.getProxyCenter = function(fragId, offset) {

        var center = offset;

        if (fragId !== -1) {
            center = Autodesk.Viewing.Extensions.Markers.nodeOffsetToWorld(center, fragId, this.viewer);
        }

        return Autodesk.Viewing.Extensions.Markers.worldToClient(center, this.viewer);

    }

    /**
     * Toggles highlight for the whole model.
     * @param {boolean} highlight Whether we want to highlight the whole model or not.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.setModelHighlight = function (highlight) {

        if(!this.viewer.model || this.viewer.model.is2d()) {
            return;
        }

        this.clearHighlightedNodes();

        if (highlight) {
            this.highlightNode(this.viewer.model.getRoot());
        }
    }

    /**
     * Highlights a node in the model through the markup overlay.
     * @param {Object} object The node to highlight.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.highlightNode = function (dbid) {

        markers = this;
        var fragIds;
        var root = this.viewer.model.getRoot();
        if (root && root.dbId === dbid) {

            // For the model's root, we fetch all fragments.
            var fragmentCount = this.viewer.model.getData().fragments.fragId2dbId.length;
            fragIds = new Array(fragmentCount);
            for (var i = 0; i < fragmentCount; ++i) {
                fragIds[i] = i;
            }
        }
        else
        {
            // For every other non-model node, we just fetch its fragment(s).
            var fragId = Autodesk.Comments2.LmvUtils.getFragmentId(this.viewer.model, dbid);
            fragIds = Autodesk.Viewing.Extensions.Markers.getFragmentsIdsInSameNode(this.viewer.model, fragId);
        }

        var meshes = [];
        for (var i = 0; i < fragIds.length; ++i) {
            var fragId = fragIds[i];
            var mesh = this.viewer.impl.getRenderProxy(this.viewer.model, fragId);

            if (!mesh || mesh.markupHighlightProxy) {
                continue;
            }
            var selectionProxy = new THREE.Mesh(mesh.geometry, mesh.material);
            selectionProxy.matrix.copy(mesh.matrixWorld);
            selectionProxy.matrixAutoUpdate = false;
            selectionProxy.matrixWorldNeedsUpdate = true;
            selectionProxy.frustumCulled = false;

            mesh.markupHighlightProxy = selectionProxy;
            this.viewer.impl.addOverlay("markers", mesh.markupHighlightProxy);
            meshes.push(mesh);
        }

        if (meshes.length) {
            this.highlightedMeshes[dbid] = meshes;
        }
    }

    /**
     * Clears markup highlights for a nodes in model.
     * @param node Node whose highlight will be cleared.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.clearHighlightedNode = function (dbid) {

        // Clear everything when applied to root node.
        var root = this.viewer.model.getRoot();
        if (root && root.dbId === dbid) {
            this.clearHighlightedNodes();
            return;
        }

        // Abort if node is not highlighted.
        var nodeMeshes = this.highlightedMeshes[dbid];
        if(!Array.isArray(nodeMeshes)) {
            return;
        }

        // Clear highlight from the node.
        for (var i = 0, len = nodeMeshes.length; i<len; ++i) {
            var mesh = nodeMeshes[i];
            this.viewer.impl.removeOverlay("markers", mesh.markupHighlightProxy);
            delete mesh["markupHighlightProxy"];
        }

        delete this.highlightedMeshes[dbid];
    };

    /**
     * Clears markup highlights from all nodes in model.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.clearHighlightedNodes = function () {

        // TODO: clearOverlay's implementation throws a runtime error.
        // this.viewer.impl.clearOverlay("markers");

        // Alternative approach.
        for (var id in this.highlightedMeshes) {

            var nodeMeshes = this.highlightedMeshes[id];
            for (var i = 0, len = nodeMeshes.length; i<len; ++i) {
                var mesh = nodeMeshes[i];
                this.viewer.impl.removeOverlay("markers", mesh.markupHighlightProxy);
                mesh.markupHighlightProxy = null;
            }
        }
        this.highlightedMeshes = {};
    }

    /**
     *
     * @param id
     * @param index
     * @param drawCallback
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.addOverlayGraphicsLayer = function(id, index, drawCallback) {

        function comparer(layerA, layerB) {

            if (layerA.index < layerB.index) {
                return-1;
            }

            if (layerA.index > layerB.index) {
                return 1;
            }

            return 0;
        }

        var layer = {
            id: id,
            index: index,
            drawCallback: drawCallback
        };

        this.overlaysGraphicsLayers.push(layer);
        this.overlaysGraphicsLayers.sort(comparer);
    }

    /**
     *
     * @param id
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.removeOverlayGraphicsLayer = function(id) {

        var index = this.getIndexFromId(id, this.overlaysGraphicsLayers);
        if (index != -1) {
            this.overlaysGraphicsLayers.splice(index, 1);
        }
    }

    /**
     *
     * @param ctx
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.updateOverlayGraphicsLayers = function(ctx) {

        var layers = this.overlaysGraphicsLayers;
        var layerCount = layers.length;

        for (var i = 0; i < layerCount; ++i) {
            layers[i].drawCallback(ctx);
        }
    }

    /**
     * Draw a gizmo line from the initial position to end position.
     * @param {CanvasRenderingContext2D} Context used to draw the line.
     * @param {xO} Initial position in x-axis of the line segment.
     * @param {yO} Initial position in y-axis of the line segment.
     * @param {xF} Final position in x-axis of the line segment.
     * @param {yF} Final position in y-axis of the line segment.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.drawLine = function(ctx, xO, yO, xF, yF) {

        // border
        ctx.lineWidth = this.gizmosBorderWidth;
        Autodesk.Viewing.Extensions.Markers.drawLine(ctx, xO, yO, xF, yF, this.gizmosBorderColor);
        Autodesk.Viewing.Extensions.Markers.drawCircle(ctx, xO, yO, this.gizmosCircleBorderRadio, this.gizmosBorderColor);

        // line
        ctx.lineWidth = this.gizmosLineWidth;
        Autodesk.Viewing.Extensions.Markers.drawLine(ctx, xO, yO, xF, yF, this.gizmosColor);
        Autodesk.Viewing.Extensions.Markers.drawCircle(ctx, xO, yO, this.gizmosCircleRadio, this.gizmosColor);
    }

    /**
     * Draw a bounding box over the viewer.
     * @param {CanvasRenderingContext2D} Context used to draw the bounding box.
     * @param {THREE.Box2} Bounding box to be draw.
     * @param {string} Color used to draw the bounding box.
     * @param {number} Alpha used to draw the bounding box.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.drawBoundingBox = function(ctx, boundingBox, color, alpha) {

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.rect(boundingBox.min.x, boundingBox.min.y, boundingBox.max.x - boundingBox.min.x, boundingBox.max.y - boundingBox.min.y);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    /**
     * Calculates the initial position of a marker group, that is, collisions with other markers are not resolved.
     * @param {object} group Marker group that will be positioned.
     * @param {THREE.Vector2} modelCenter
     * @param {number} modelMinX
     * @param {number} modelMaxX
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.updateMarkerGroup = function(group, modelCenter, modelMinX, modelMaxX) {

        if (group.clipped) {

            group.x = group.proxyCenter.x;
            group.y = group.proxyCenter.y;

            this.restrainToViewerBounds(group);
        } else {

            this.placeOutsideModelBoundingBox(group, modelCenter, modelMinX, modelMaxX);
            if (!this.hasMinimumLength(group)) {
                this.placeOutsideModelBoundingBox(group, modelCenter, modelMinX, modelMaxX, !group.flip);
            }
        }
    }

    /**
     * Calculates and sets to all marker groups their proxies' centers (node's bounding box center transformed and projected
     * into client space coordinates).
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.updateProxiesCenters = function() {

        var containerWidth = this.container.offsetWidth;
        var containerHeight = this.container.offsetHeight;

        var markerGroups = this.markerGroups;
        var markerGroupCount = markerGroups.length;

        for (var i = 0; i < markerGroupCount; ++i) {

            var markerGroup = markerGroups[i];
            var proxyCenter = this.getProxyCenter(markerGroup.fragId, markerGroup.centerOffset);

            markerGroup.proxyCenter = proxyCenter;

            markerGroup.visible =
                proxyCenter.y >= 0 && proxyCenter.y <= containerHeight;

            markerGroup.clipped =
                proxyCenter.x < 0 || proxyCenter.x > containerWidth ||
                proxyCenter.y < 0 || proxyCenter.y > containerHeight;
        }

        var lines = this.lines;
        var lineCount = lines.length;

        for (var i = 0; i < lineCount; ++i) {

            var line = lines[i];
            line.proxyCenter = this.getProxyCenter(line.fragId, line.centerOffset);
        }
    }

    /**
     * Calculates and sets two bounding boxes for the marker group (htmlBoundingBox and wholeBoundingBox).
     * HtmlBoundingBox is a rectangle that fits only the HTML element of the marker group.
     * WholeBoundingBox is a rectangle that fits the html bounding box and the marker proxy center.
     * @param {object} group Marker group whose bounding boxes will be updated.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.updateMarkerGroupBoundingBoxes = function(group) {

        var htmlBoundingBox = group.htmlBoundingBox;
        var wholeBoundingBox = group.wholeBoundingBox;
        var min, max;

        // Calculate and set HTML bounding box.
        min = htmlBoundingBox.min;
        max = htmlBoundingBox.max;

        min.x = Math.round(group.x + group.htmlOffset.x);
        min.y = Math.round(group.y + group.htmlOffset.y);
        max.x = min.x + group.htmlSize.x;
        max.y = min.y + group.htmlSize.y;

        htmlBoundingBox.width = max.x - min.x;
        htmlBoundingBox.height = max.y - min.y;

        // Calculate and set whole bounding box.
        wholeBoundingBox.set(min, max);
        wholeBoundingBox.expandByPoint(group.proxyCenter);

        min = wholeBoundingBox.min;
        max = wholeBoundingBox.max;

        wholeBoundingBox.width = max.x - min.x;
        wholeBoundingBox.height = max.y - min.y;
    }

    /**
     * Searches for overlaps between marker groups and changes theirs positions to avoid overlappings.
     * @param {THREE.Vector2} modelCenter Model's bounding box center transformed and projected into client space coordinates.
     * @param {number} modelMinX Minimum x-axis value of the model's bounding box transformed and projected into client space coordinate.
     * @param {number} modelMaxX Maximum x-axis value of the model's bounding box transformed and projected into client space coordinate.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.resolveMarkersCollisions = function(modelCenter, modelMinX, modelMaxX) {

        var markerGroups = this.markerGroups;
        var markerGroupCount = markerGroups.length;
        var colliders = new Array();

        // Try to avoid whole collisions.
        for (var i = 0; i < markerGroupCount; ++i) {

            this.getMarkerGroupColliders(markerGroups[i], colliders, false);
            for (var j = 0; j < colliders.length; ++j)
            {
                var colliderA = markerGroups[i];
                var colliderB = colliders[j];

                this.placeOutsideModelBoundingBox(colliderA, modelCenter, modelMinX, modelMaxX, !colliderA.flip);

                if (this.hasMinimumLength(colliderA) &&
                    !this.isMarkerGroupColliding(colliderA, false) &&
                    !this.isMarkerGroupColliding(colliderB, false)) {
                    continue;
                }

                this.placeOutsideModelBoundingBox(colliderA, modelCenter, modelMinX, modelMaxX, !colliderA.flip);
                this.placeOutsideModelBoundingBox(colliderB, modelCenter, modelMinX, modelMaxX, !colliderB.flip);

                if (this.hasMinimumLength(colliderB) &&
                    !this.isMarkerGroupColliding(colliderA, false) &&
                    !this.isMarkerGroupColliding(colliderB, false)) {
                    continue;
                }

                this.placeOutsideModelBoundingBox(colliderB, modelCenter, modelMinX, modelMaxX, !colliderB.flip);
            }
        }

        // Try to avoid html collisions.
        for (var i = 0; i < markerGroupCount; ++i) {

            this.getMarkerGroupColliders(markerGroups[i], colliders, false);
            for (var j = 0; j < colliders.length; ++j) {

                var colliderA = markerGroups[i];
                var colliderB = colliders[j];

                // push markers outwards and move the one that has to move less distance to avoid collision.
                var deltaA, deltaB, moduleA, moduleB;

                deltaA = this.getPushDeltaPosition(colliderA, true);
                deltaB = this.getPushDeltaPosition(colliderB, true);

                moduleA = Math.abs(deltaA);
                moduleB = Math.abs(deltaB);

                if (moduleA > 0 || moduleB > 0) {

                    if (moduleA < moduleB) {
                        colliderA.x += deltaA;
                        this.setFlip(colliderA, colliderA.x > colliderA.proxyCenter.x);
                    } else {
                        colliderB.x += deltaB;
                        this.setFlip(colliderB, colliderB.x > colliderB.proxyCenter.x);
                    }
                    continue;
                }

                // Push markers inwards and move the one that has to move less distance to avoid collision.
                deltaA = this.getPushDeltaPosition(colliderA, false);
                deltaB = this.getPushDeltaPosition(colliderB, false);

                moduleA = Math.abs(deltaA);
                moduleB = Math.abs(deltaB);

                if (moduleA > 0 || moduleB > 0) {

                    if (moduleA < moduleB) {
                        colliderA.x += deltaA;
                        this.setFlip(colliderA, colliderA.x > colliderA.proxyCenter.x);
                    } else {
                        colliderB.x += deltaB;
                        this.setFlip(colliderB, colliderB.x > colliderB.proxyCenter.x);
                    }
                    continue;
                }
            }
        }
    }

    /**
     * Sets flip state adjusting html size and offset accordingly to the marker flip direction. Also, updates marker group
     * bounding boxes.
     * @param {object} group Marker groups whose flip state will be updated.
     * @param {boolean} flip Flip state to be applied.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.setFlip = function(group, flip)
    {
        group.flip = flip;

        var firstHtml = group[0].html;

        group.htmlSize.x = firstHtml.offsetWidth * group.length;
        group.htmlSize.y = firstHtml.offsetHeight;

        group.htmlOffset.x = group.flip ? -firstHtml.offsetWidth * 0.5 : firstHtml.offsetWidth * 0.5 - group.htmlSize.x;
        group.htmlOffset.y =-firstHtml.offsetHeight * 0.5;


        group.htmlSize.x = firstHtml.offsetWidth * group.length;
        group.htmlSize.y = firstHtml.offsetHeight;

        group.htmlOffset.x = group.flip ? -firstHtml.offsetWidth * 0.5 : firstHtml.offsetWidth * 0.5 - group.htmlSize.x;
        group.htmlOffset.y =-firstHtml.offsetHeight * 0.5;

        this.updateMarkerGroupBoundingBoxes(group);
    }

    /**
     * Returns the minimum delta position a marker has to be moved so its html bounding box doesn't collide with other
     * html bounding boxes. The new position is calculated moving the marker outwards or inwards the model (as specified by
     * the caller). If it's not possible to get a new position for the marker 0 is returned.
     * @param {object} group Marker group whose delta position will be calculated.
     * @param {boolean} outwards True if the marker group should be moved outwards the model, false, otherwise.
     * @returns {number} The delta position the model has to be moved to avoid overlappings with other marker groups.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.getPushDeltaPosition = function(group, outwards)
    {
        var direction = (outwards ? 1 : -1) * (group.flip ? 1 : -1);
        var directionStep = direction * 20;
        var deltaPosition = 0;

        while (true) {

            group.x += directionStep;
            deltaPosition += directionStep;
            this.updateMarkerGroupBoundingBoxes(group);

            if (this.isHtmlOutsideBounds(group)) {

                group.x -= deltaPosition;
                this.updateMarkerGroupBoundingBoxes(group);
                return 0;
            }

            if (this.hasMinimumLength(group)) {

                if (!this.isMarkerGroupColliding(group, true)) {

                    group.x -= deltaPosition;
                    this.updateMarkerGroupBoundingBoxes(group);
                    return deltaPosition;
                }
            }
        }
    }

    /**
     * Checks if the HTML element of the marker group lays outside the HTML Bounds of the viewer. The HTML Bounds of the
     * viewer is an area shrinked by a fixed amount of the client area of the viewer. Markers that are not clipped stays
     * inside the  html bound. A marker is marked as clipped if its proxy center lays outside the viewer's client area.
     * @param {object} group Marker group used for the test.
     * @returns {boolean} True if the marker html bounding box lays totally inside html bounds.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.isHtmlOutsideBounds = function(group) {

        var htmlBounds = this.htmlBounds;
        var htmlBoundingBox = group.htmlBoundingBox;

        var htmlBoundsMinX = htmlBounds.min.x;
        var htmlBoundsMaxX = htmlBounds.max.x;

        if (group.htmlBoundingBox.isIntersectionBox(this.modelMarkersBoundingBox)) {
            htmlBoundsMinX = this.modelMarkersBoundingBox.max.x;
        }

        if (htmlBoundingBox.max.x > htmlBoundsMaxX) {
            return true;
        }

        if (htmlBoundingBox.min.x < htmlBoundsMinX) {
            return true;
        }
        return false;
    }

    /**
     * Snap clipped marker group's position to the Viewer client area's borders.
     * @param {object} group Marker group whose position will be restrained.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.restrainToViewerBounds = function(group) {

        var viewerBounds = this.viewerBounds;

        if (group.proxyCenter.x < viewerBounds.min.x) {

            group.x = viewerBounds.min.x;
            this.setFlip(group, false);
            return;
        }

        if (group.proxyCenter.x > viewerBounds.max.x) {

            group.x = viewerBounds.max.x;
            this.setFlip(group, true);
            return;
        }
    }

    /**
     * Place marker group trying to avoid overlapping with model geometry.
     * @param {object} group Marker group whose position will be updated.
     * @param {THREE.Vector2} modelCenter Model's bounding box center transformed and projected into client space coordinates.
     * @param {number} modelMinX Minimum x-axis value of the model's bounding box transformed and projected into client space coordinate.
     * @param {number} modelMaxX Maximum x-axis value of the model's bounding box transformed and projected into client space coordinate.
     * @param [flip] If provided marker will use this flip state, otherwise, flip state will be calculated.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.placeOutsideModelBoundingBox = function(group, modelCenter, modelMinX, modelMaxX, flip) {

        group.distanceFromCenter = Math.abs(group.proxyCenter.x - modelCenter.x);

        var canditatePositionA = group.distanceFromCenter * 0.5 + modelMaxX;
        var canditatePositionB =-group.distanceFromCenter * 0.5 + modelMinX;

        if (flip === undefined) {

            if (modelMinX < this.htmlBounds.min.x ||
                modelMaxX > this.htmlBounds.max.x) {

                flip = modelMinX < this.htmlBounds.min.x;
            } else {

                flip =
                    Math.abs(group.proxyCenter.x - canditatePositionA) <
                    Math.abs(group.proxyCenter.x - canditatePositionB);
            }
        }

        group.x = flip ? canditatePositionA : canditatePositionB;
        group.y = group.proxyCenter.y;
        this.setFlip(group, flip);

        // Calculate html size and offset.
        if (!this.hasMinimumLength(group)) {

            group.x = group.proxyCenter.x + (this.minimumGroupMarkerWidth + group.htmlSize.x) * (group.flip ? 1 : -1);
            this.updateMarkerGroupBoundingBoxes(group);
        }

        this.restrainToHtmlBounds(group);
    }

    /**
     * Snap clipped marker group's position to the viewer html bounds.
     * @param {object} group Marker groups whose position will be restrained.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.restrainToHtmlBounds = function(group) {

        var htmlBounds = this.htmlBounds;
        var htmlBoundingBox = group.htmlBoundingBox;

        var htmlBoundsMinX = htmlBounds.min.x;
        var htmlBoundsMaxX = htmlBounds.max.x;

        if (group.htmlBoundingBox.isIntersectionBox(this.modelMarkersBoundingBox)) {
            htmlBoundsMinX = this.modelMarkersBoundingBox.max.x;
        }

        if (htmlBoundingBox.max.x > htmlBoundsMaxX) {
            group.x = htmlBoundsMaxX - group.htmlOffset.x - group.htmlSize.x;
            this.updateMarkerGroupBoundingBoxes(group);
            return;
        }

        if (htmlBoundingBox.min.x < htmlBoundsMinX) {
            group.x = htmlBoundsMinX - group.htmlOffset.x;
            this.updateMarkerGroupBoundingBoxes(group);
            return;
        }
    }

    /**
     * Checks if the marker group line has the minimum length allowed.
     * @param {object} group Marker group whose length will be tested.
     * @returns {boolean} True if marker group's line has the minimum length.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.hasMinimumLength = function(group) {

        return group.clipped || (group.wholeBoundingBox.width - group.htmlBoundingBox.width) >= this.minimumGroupMarkerWidth;
    }

    /**
     * Sort markers groups from top to bottom.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.sortMarkerGroups = function() {

        function comparer(groupA, groupB) {

            if (groupA.proxyCenter.y < groupB.proxyCenter.y) {
                return-1;
            }

            if (groupA.proxyCenter.y > groupB.proxyCenter.y) {
                return 1;
            }

            return 0;
        }

        this.markerGroups.sort(comparer);
    }

    /**
     * Get all group markers overlapping with the one provided by the caller.
     * @param {object} group Marker group that will be tested against all others.
     * @param {Array} Collection to be filled with overlapping markers.
     * @param {boolean} checkHTMLOnly Indicates if html bounding boxes or whole bounding boxes have to be used for overlapping tests.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.getMarkerGroupColliders = function(group, colliders, checkHTMLOnly) {

        var markerGroups = this.markerGroups;
        var markerGroupCount = markerGroups.length;

        colliders.splice(0, colliders.length);

        if (group.clipped) {
            return;
        }

        for (var i = 0; i < markerGroupCount; ++i) {

            var markerGroup = markerGroups[i];

            if (markerGroup === group) {
                continue;
            }

            if (markerGroup.clipped) {
                continue;
            }

            if (checkHTMLOnly) {

                if(markerGroup.htmlBoundingBox.isIntersectionBox(group.htmlBoundingBox)) {
                    colliders.push(markerGroup);
                }
            }
            else {

                if(markerGroup.wholeBoundingBox.isIntersectionBox(group.wholeBoundingBox)) {
                    colliders.push(markerGroup);
                }
            }
        }
    }

    /**
     * Checks if a marker group is overlapping with any other.
     * @param {object} group Marker group that will be tested against all others.
     * @param {boolean} checkHTMLOnly Indicates if html bounding boxes or whole  bounding boxes have to be used for overlapping tests.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerMarkers.prototype.isMarkerGroupColliding = function(group, checkHTMLOnly) {

        var markerGroups = this.markerGroups;
        var markerGroupCount = markerGroups.length;

        if (group.clipped) {
            return false;
        }

        // Check against node markers.
        for (var i = 0; i < markerGroupCount; ++i) {

            var markerGroup = markerGroups[i];

            if (markerGroup === group) {
                continue;
            }

            if (markerGroup.clipped) {
                continue;
            }

            if (checkHTMLOnly) {

                if (markerGroup.htmlBoundingBox.isIntersectionBox(group.htmlBoundingBox)) {
                    return true;
                }
            }
            else {

                if (markerGroup.wholeBoundingBox.isIntersectionBox(group.wholeBoundingBox)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Register the extension with the extension manager.
     */
    Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Comments2.Markers', Autodesk.Viewing.Extensions.Markers.ViewerMarkers);
}
/**
 * Contains functions used by ViewerMarker, ViewerMarkups and ViewerPinTool.
 */
namespaceFunction('Autodesk.Viewing.Extensions.Markers');

/**
 * Creates an frame to be used when a extension enters edit mode.
 * @param {String} message - shown on top of the frame
 * @param {Function} onCloseCallback
 * @returns {Element}
 */
Autodesk.Viewing.Extensions.Markers.createEditFrame = function(message, onCloseCallback) {

    var frameDiv = document.createElement("div");

    frameDiv.className = "markers-edit-frame";
    frameDiv.id = "markers-edit-frame";
    frameDiv.style.left = 0;
    frameDiv.style.top = 0;
    frameDiv.style.right = 0;
    frameDiv.style.bottom = 0;
    frameDiv.style.backgroundColor = "transparent";
    frameDiv.style.position = "absolute";
    frameDiv.style.zIndex = 10;

    // Add markup drawing cancel message.
    var messageDiv = document.createElement("div");
    messageDiv.className = "markers-edit-frame-message-container";
    messageDiv.textContent = Autodesk.Viewing.i18n.translate(message);
    messageDiv.setAttribute("data-i18n", message);

    frameDiv.appendChild(messageDiv);

    // Separator
    var separatorDiv = document.createElement("div");
    separatorDiv.className = "markers-edit-frame-separator";
    frameDiv.appendChild(separatorDiv);

    // Add markup drawing cancel button.
    var onCancelMove = function(event) {

        event.cancelBubble = true;
        event.preventDefault();
    };

    var onCancelClick = function(event) {

        event.cancelBubble = true;
        event.preventDefault();

        if (onCloseCallback) {
            onCloseCallback();
        }
    };

    var button = document.createElement("reset");
    button.className = "markers-edit-frame-cancel-button";
    button.textContent = Autodesk.Viewing.i18n.translate("Cancel");
    button.setAttribute("data-i18n", "Cancel");
    button.addEventListener("mousemove", onCancelMove);
    button.addEventListener("mouseup", onCancelClick);

    frameDiv.appendChild(button);

    return frameDiv;
}

/**
 * Shows panels and tools in the viewer.
 * @param viewer
 */
Autodesk.Viewing.Extensions.Markers.showToolsAndPanels = function(viewer) {

    // Restore view cube.
    viewer.displayViewCube(true, false);

    // TODO: Find or ask for a better way to restore this buttons.
    if (viewer.homeViewContainer) {
        viewer.homeViewContainer.style.display = "block";
    }

    if (viewer.infoButton) {
        viewer.infoButton.style.display = "block";
    }

    if (viewer.toolbar.container) {
        viewer.toolbar.container.style.display = "block";
    }
}

/**
 * Hides panels and tools in the viewer.
 * @param viewer
 */
Autodesk.Viewing.Extensions.Markers.hideToolsAndPanels = function(viewer) {

    // Hide Panels and tools.
    viewer.displayViewCube(false, false);

    // TODO: Find or ask for a better way to hide this buttons.
    if (viewer.homeViewContainer) {
        viewer.homeViewContainer.style.display = "none";
    }

    if (viewer.infoButton) {
        viewer.infoButton.style.display = "none";
    }

    if (viewer.toolbar.container) {
        viewer.toolbar.container.style.display = "none";
    }
}

/**
 * Returns the mouse pointer position in viewer's client coordinate space.
 * @param {MouseEvent} event Mouse event.
 * @returns {THREE.Vector2} Position of the mouse pointer.
 * @private
 */
Autodesk.Viewing.Extensions.Markers.getMousePosition = function(event) {

    var target = event.target || event.srcElement;
    var rect = target.getBoundingClientRect();

    return new THREE.Vector2(
        event.clientX - rect.left,
        event.clientY - rect.top);
}

/**
 *
 * @param point
 * @returns {THREE.Vector4}
 */
Autodesk.Viewing.Extensions.Markers.worldToViewport = function(point, viewer) {

    var p = new THREE.Vector4();

    p.x = point.x;
    p.y = point.y;
    p.z = point.z;
    p.w = 1;

    p.applyMatrix4(viewer.impl.camera.matrixWorldInverse);
    p.applyMatrix4(viewer.impl.camera.projectionMatrix);

    // Don't want to mirror values with negative z (behind camera). If camera is inside bounding box, better to throw
    // markers to the screen sides.
    if (p.w > 0)
    {
        p.x /= p.w;
        p.y /= p.w;
        p.z /= p.w;
    }

    return p;
}

/**
 * Calculates the pixel position in client space coordinates of a point in world space.
 * @param {THREE.Vector3} point Point in world space coordinates.
 * @returns {THREE.Vector3} Point transformed and projected into client space coordinates.
 * @private
 */
Autodesk.Viewing.Extensions.Markers.worldToClient = function(point, viewer) {

    var p = Autodesk.Viewing.Extensions.Markers.worldToViewport(point, viewer);
    var result = viewer.impl.viewportToClient(p.x, p.y);

    // snap to the center of the pixel
    result.x = Math.floor(result.x) + 0.5;
    result.y = Math.floor(result.y) + 0.5;

    return result;
}

/**
 * Draw a line segment over the viewer.
 * @param {CanvasRenderingContext2D} Context used to draw the line.
 * @param {xO} Initial position in x-axis of the line segment.
 * @param {yO} Initial position in y-axis of the line segment.
 * @param {xF} Final position in x-axis of the line segment.
 * @param {yF} Final position in y-axis of the line segment.
 * @param {color} Color used to draw the line segment.
 * @private
 */
Autodesk.Viewing.Extensions.Markers.drawLine = function (ctx, xO, yO, xF, yF, color) {

    ctx.beginPath();
    ctx.moveTo(xO, yO);
    ctx.lineTo(xF, yF);
    ctx.strokeStyle = color;
    ctx.stroke();
}

/**
 * Draw a circle over the viewer.
 * @param {CanvasRenderingContext2D} ctx Context used to draw the circle.
 * @param {number} x X-axis position of the center of circle.
 * @param {number} y Y-axis position of the center of circle.
 * @param {number} radius Radius of the circle.
 * @param {string} color Color used to draw the circle.
 * @private
 */
Autodesk.Viewing.Extensions.Markers.drawCircle = function(ctx, x, y, radius, color) {

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

/**
 * Draw a circumference over the viewer.
 * @param {CanvasRenderingContext2D} Context used to draw the circumference.
 * @param {number} x X-axis position of the center of the circumference.
 * @param {number} y Y-axis position of the center of the circumference.
 * @param {number} radius Radius of the circumference.
 * @param {string} color Color used to draw the circumference.
 * @private
 */
Autodesk.Viewing.Extensions.Markers.drawCircumference = function(ctx, x, y, radius, color) {

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.strokeStyle = color;
    ctx.stroke();
}

/**
 * Return the offset needed to be applied to pixel positions to a draw a stroke avoiding re-sampling.
 * @param strokeWidth
 * @returns {number}
 */
Autodesk.Viewing.Extensions.Markers.getPixelOffset = function(strokeWidth) {

    return strokeWidth % 2 == 0 ? 0 : 0.5;
}

/**
 *
 * @param viewer
 */
Autodesk.Viewing.Extensions.Markers.getNodeVisibilityTable = function(viewer) {

    // No visibility table for 2d models.
    if (viewer.model.is2d()) {
        return {};
    }

    // get isolated nodes
    var isolatedNodes = viewer.getIsolatedNodes();
    var isolatedNodesCount = isolatedNodes.length;
    var isolatedNodesTable = {};
    var i;

    for(i = 0; i < isolatedNodesCount; ++i) {
        isolatedNodesTable[isolatedNodes[i].dbId] = true;
    }

    // get hidden nodes
    var hiddenNodes = viewer.getHiddenNodes();
    var hiddenNodesCount = hiddenNodes.length;
    var hiddenNodesTable = {};

    for(i = 0; i < hiddenNodesCount; ++i) {
        hiddenNodesTable[hiddenNodes[i].dbId] = true;
    }

    // get visibility table
    var table = {};

    // If no instanceTree present, build table based on fragIds.
    var root = viewer.model.getRoot();
    if (!root) {
        var fragToDbId = viewer.model.getData().fragments.fragId2dbId;
        var fragCount = fragToDbId.length;

        var defaultVisibility = (isolatedNodesCount === 0);
        for (var fragId = 0; fragId < fragCount; ++fragId) { // FragIds are 0-based
            table[fragToDbId[fragId]] = defaultVisibility;
        }
        // ISOLATED nodes won't have children to isolate
        for(i = 0; i < isolatedNodesCount; ++i) {
            table[fragToDbId[isolatedNodes[i].fragIds]] = true;
        }
        // HIDDEN nodes won't have children to hide
        for(i = 0; i < hiddenNodesCount; ++i) {
            table[fragToDbId[hiddenNodes[i].fragIds]] = false;
        }
        // Nothing else to do here.
        return table;
    }

    var rootIsolated = isolatedNodesCount === 0;
    var rootIsHidden = hiddenNodesTable[root.dbId] === true;

    var createNodeVisibilityTable = function(node, parentIsIsolated, parentIsHidden, isolatedNodes, hiddenNodes, outTable) {

        var dbid =  node.dbId;
        var isolated = parentIsIsolated || isolatedNodes[dbid] === true;
        var hidden = parentIsHidden || hiddenNodes[dbid] === true;

        outTable[dbid] = isolated && !hidden;

        var children = node.children;
        var childrenCount = children ? children.length : 0;

        for(var i = 0; i < childrenCount; ++i) {

            createNodeVisibilityTable(children[i], isolated, hidden, isolatedNodes, hiddenNodes, outTable);
        }
    };

    createNodeVisibilityTable(root, rootIsolated, rootIsHidden, isolatedNodesTable, hiddenNodesTable, table);
    return table;
};

/**
 *
 * @param fragmentsIds
 * @param fragmentList
 * @returns {THREE.Box3}
 */
Autodesk.Viewing.Extensions.Markers.getOriginalWorldMatrix = function(fragmentId, viewer) {

    function getFragmentTransform(dstmtx, fragments, fragId) {

        var mtxOffset = fragId * 12;
        var fragTransforms = fragments.transforms;

        if (!fragTransforms)
            return null;

        var cur = dstmtx.elements, orig = fragTransforms, i = mtxOffset;
        cur[0] = orig[i+0];  cur[1] = orig[i+1];   cur[2] = orig[i+2];   cur[3] = 0;
        cur[4] = orig[i+3];  cur[5] = orig[i+4];   cur[6] = orig[i+5];   cur[7] = 0;
        cur[8] = orig[i+6];  cur[9] = orig[i+7];   cur[10] = orig[i+8];  cur[11] = 0;
        cur[12] = orig[i+9]; cur[13] = orig[i+10]; cur[14] = orig[i+11]; cur[15] = 1;

        return dstmtx;
    }

    var svfLoader = viewer.impl.svfloader;
    var svf = svfLoader.svf;
    var matrix = new THREE.Matrix4();
    getFragmentTransform(matrix, svf.fragments, fragmentId);
    return matrix;

};

/**
 *
 * @param fragmentsIds
 * @param fragmentList
 * @returns {THREE.Box3}
 */
Autodesk.Viewing.Extensions.Markers.getOriginalWorldBoundingBox = function(fragmentsIds, fragmentList) {

    var fragBoundingBox = new THREE.Box3();
    var nodeBoundingBox = new THREE.Box3();

    var fragmentBoxes = fragmentList.boxes;
    var fragsIdsCount = fragmentsIds.length;

    for(var i = 0; i < fragsIdsCount; ++i) {

        var boffset = fragmentsIds[i] * 6;

        fragBoundingBox.min.x = fragmentBoxes[boffset];
        fragBoundingBox.min.y = fragmentBoxes[boffset+1];
        fragBoundingBox.min.z = fragmentBoxes[boffset+2];
        fragBoundingBox.max.x = fragmentBoxes[boffset+3];
        fragBoundingBox.max.y = fragmentBoxes[boffset+4];
        fragBoundingBox.max.z = fragmentBoxes[boffset+5];

        nodeBoundingBox.union(fragBoundingBox);
    }

    return nodeBoundingBox;
};

/**
 *
 * @param fragmentsIds
 * @param fragmentList
 * @returns {THREE.Box3}
 */
Autodesk.Viewing.Extensions.Markers.getModifiedWorldBoundingBox = function(fragmentsIds, fragmentList) {

    var fragBoundingBox = new THREE.Box3();
    var nodeBoundingBox = new THREE.Box3();

    var fragsIdsCount = fragmentsIds.length;

    for(var i = 0; i < fragsIdsCount; ++i) {

        fragmentList.getWorldBounds(fragmentsIds[i], fragBoundingBox);
        nodeBoundingBox.union(fragBoundingBox);
    }

    return nodeBoundingBox;
};

Autodesk.Viewing.Extensions.Markers.getFragmentsIdsInSameNode = function(model, fragmentId) {

    var fragmentsIds = new Array();

    var fragId2dbId = model.getData().fragments.fragId2dbId;
    var fragId2dbIdCount = fragId2dbId.length;

    var dbId = fragId2dbId[fragmentId];

    for (var i = 0; i < fragId2dbIdCount; ++i) {
        if (fragId2dbId[i] === dbId) {
            fragmentsIds.push(i);
        }
    }

    return fragmentsIds;
};

/**
 * Converts a 3d point in world coordinates to an offset from the center of the original bounding box of
 * the node the fragment belongs (the bounding box is calculated as the union of all fragment bounding boxes in the node,
 * children are excluded).
 * @param {THREE.Vector3} point Position in world coordinates to convert in an offset.
 * @param {Number} fragmentId Fragment from where the point in world coordinates was obtained (-1 for 2d models).
 * @param {Autodesk.Viewing.Viewer} viewer Instance to the viewer.
 * @returns {THREE.Vector3} Calculated offset.
 */
Autodesk.Viewing.Extensions.Markers.worldToNodeOffset = function(point, fragmentId, viewer) {

    var offset = point.clone();

    // If fragmentId is -1 the model is 2d and the offset is the world position.
    if (fragmentId === -1) {
        return offset;
    }

    // Obtain all fragments in the node our fragment resides.
    var proxy = viewer.impl.getRenderProxy(viewer.model, fragmentId);
    var fragmentList = viewer.impl.modelQueue().getFragmentList(viewer.model);
    var fragmentsIds = Autodesk.Viewing.Extensions.Markers.getFragmentsIdsInSameNode(viewer.model, fragmentId);

    var originalWorldCenter = Autodesk.Viewing.Extensions.Markers.getOriginalWorldBoundingBox(fragmentsIds, fragmentList).center();
    var originalWorld = Autodesk.Viewing.Extensions.Markers.getOriginalWorldMatrix(fragmentId, viewer);
    var invCurrentWorld = proxy.matrixWorld.clone();
    invCurrentWorld.getInverse(invCurrentWorld);

    offset.applyMatrix4(invCurrentWorld);
    offset.applyMatrix4(originalWorld);
    offset.sub(originalWorldCenter);

    return offset;
};

/**
 * Converts an offset from the center of the original bounding box (the bounding box is calculated as the union of all
 * fragment bounding boxes in the node, children are excluded) to a 3d point in world coordinates.
 * the node the fragment belongs (the bounding box is calculated as the union of all fragment bounding boxes in the node,
 * children are excluded).
 * @param {THREE.Vector3} point Position in world coordinates to convert in an offset.
 * @param {Number} fragmentId Fragment from where the point in world coordinates was obtained (-1 for 2d models).
 * @param {Autodesk.Viewing.Viewer} viewer Instance to the viewer.
 * @returns {THREE.Vector3} Calculated offset.
 */
Autodesk.Viewing.Extensions.Markers.nodeOffsetToWorld = function(offset, fragmentId, viewer) {

    var point = offset.clone();

    // If fragmentId is -1 the model is 2d and the offset is the world position.
    if (fragmentId === -1) {
        return point;
    }

    // Obtain all fragments in the node our fragment resides.
    var proxy = viewer.impl.getRenderProxy(viewer.model, fragmentId);
    var fragmentList = viewer.impl.modelQueue().getFragmentList(viewer.model);
    var fragmentsIds = Autodesk.Viewing.Extensions.Markers.getFragmentsIdsInSameNode(viewer.model, fragmentId);

    var originalWorldCenter = Autodesk.Viewing.Extensions.Markers.getOriginalWorldBoundingBox(fragmentsIds, fragmentList).center();
    var invOriginalWorld = Autodesk.Viewing.Extensions.Markers.getOriginalWorldMatrix(fragmentId, viewer);
    var currentWorld = proxy.matrixWorld.clone();
    invOriginalWorld.getInverse(invOriginalWorld);

    point.add(originalWorldCenter);
    point.applyMatrix4(invOriginalWorld);
    point.applyMatrix4(currentWorld);

    return point;
};

/**
 * Used to convert offsets stored in comments of version 1.0 to version 2.0 or grater.
 * @param {THREE.Vector3} offset
 * @param {Number} nodeId Id of the model's node the node associated with the offset, -1 can be passed for 2d models.
 * @param {Autodesk.Viewing.Viewer} viewer Instance to the viewer.
 * @returns {THREE.Vector3} Calculated offset.
 */
Autodesk.Viewing.Extensions.Markers.convertOffset = function(offset, nodeId, viewer) {

    // For 2d model offset is in world space.
    if (nodeId === -1) {
        return offset.clone();
    }

    // From old offset to world.
    var fragmentId = Autodesk.Comments2.LmvUtils.getFragmentId(viewer.model, nodeId);
    if (fragmentId === -1) {
        return offset.clone();
    }

    offset = offset.clone();

    var proxy = viewer.impl.getRenderProxy(viewer.model, fragmentId);
    if (proxy.geometry.boundingBox) {
        offset.applyMatrix4(proxy.matrixWorld);
        offset.add(proxy.geometry.boundingBox.center());
    } else {
        // For some reason, boundingBox may sometimes be null.
        // Thus, we take an alternate route to get the boundingBox's center.
        var fragmentList = viewer.impl.modelQueue().getFragmentList(viewer.model);
        var fragmentsIds = Autodesk.Viewing.Extensions.Markers.getFragmentsIdsInSameNode(viewer.model, fragmentId);
        var worldBB = Autodesk.Viewing.Extensions.Markers.getOriginalWorldBoundingBox(fragmentsIds, fragmentList);

        // offset.applyMatrix4(proxy.matrixWorld);
        offset.add(worldBB.center());
    }

    // from world to new offset.
    return Autodesk.Viewing.Extensions.Markers.worldToNodeOffset(offset, fragmentId, viewer);
};

namespaceFunction('Autodesk.Viewing.Extensions.Markers');
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importViewerPinTool = function() {
    /**
     * Constructs a ViewerPinTool object. ViewerPinTool is an extension to the viewer that permits the user to place perspective
     * corrected pin over geometry in the viewer. This class has all the logic for placing pins process, ViewerMarker is the
     * responsible of drawing the pin over its canvas.
     * @param {Autodesk.Viewing.Viewer} viewer
     * @constructor
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool = function (viewer) {

        Autodesk.Viewing.Extension.call(this, viewer);
        this.EVENT_LEAVE_EDIT_MODE = "ViewerPinTool_leave_edit_mode";
        this.EVENT_SELECTION_CHANGED = "ViewerPinTool_selection_changed";
    };

    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.constructor = Autodesk.Viewing.Extensions.Markers.ViewerPinTool;

    /**
     * Initializes the extension and create its needed resources.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.load = function () {

        // We only support Viewer3D. Bail out early if not.
        if (!(this.viewer instanceof Autodesk.Viewing.Viewer3D)) {
            return false;
        }

        // Add edit frame.
        var onCancel = function () {

            this.cancelEditMode();
            // fire event only when cancelling through UI
            this.viewer.fireEvent({ type: this.EVENT_LEAVE_EDIT_MODE, target: this });
        }.bind(this);

        var message = Autodesk.Comments2.Localization.pintool_message;
        this.editFrameDiv = Autodesk.Viewing.Extensions.Markers.createEditFrame(message, onCancel);

        this.onMouseMoveBinded = this.onMouseMove.bind(this);

        this.editFrameDiv.addEventListener("mouseout", this.onMouseOut.bind(this));
        this.editFrameDiv.addEventListener("mousedown", this.onMouseDown.bind(this));

        // Add members.
        this.editMode = false;
        this.hasSelection = false;
        this.selectedNodeId = -1;
        this.selectedNodeOffset = new THREE.Vector3();
        this.selectedFragmentId = -1;
        this.container = this.viewer.container;

        // Gizmo.
        this.gizmoInvalidColor = "#FF0000";
        this.gizmoSuccessColor = "#49C1E4";
        this.gizmoCollision = {fragmentId: -1, point: new THREE.Vector3()};

        // Add to tool controller so we can get mouse events.
        this.raycaster = new THREE.Raycaster();

        // Add overlays listener.
        var onDrawOverlay = function (ctx) {
            if (this.editMode) {
                this.updateGizmo(ctx);
                this.updateSelectionMark(ctx);
            }
        }.bind(this);

        this.markers.addOverlayGraphicsLayer("pintool-overlay", 0, onDrawOverlay);

        return true;
    };

    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.handleKeyDown = function (event) {
        if (event.keyCode === Autodesk.Viewing.theHotkeyManager.KEYCODES.ESCAPE) {
            if (this.editMode) {
                this.cancelEditMode();
                this.viewer.fireEvent({ type: this.EVENT_LEAVE_EDIT_MODE, target: this });
            }
        }
    };

    /**
     * Dispose resources created by this extension and remove event listeners.
     * @returns {boolean} True if unloading was successful
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.unload = function () {

        // Remove event listeners.
        if (this.editFrameDiv.parentNode) {
            this.editFrameDiv.parentNode.removeChild(this.editFrameDiv);
        }

        // Remove overlay layer from markers extension.
        if (this.markers) {
            this.markers.removeOverlayGraphicsLayer("pintool-overlay");
        }

        return true;
    }

    /**
     * Enters edit mode.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.enterEditMode = function () {

        // Return if there is no viewer nor model.
        if (!this.viewer || !this.viewer.model) {
            return;
        }

        // Return if already in edit mode.
        if (this.editMode) {
            return;
        }

        this.editMode = true;

        // Add edit frame div at the top of all extensions and tools, all user interaction with the viewer is suspende
        // until user selects a point.
        this.container.appendChild(this.editFrameDiv);

        this.handleKeyDownBinded = this.handleKeyDown.bind(this);
        window.addEventListener("keydown", this.handleKeyDownBinded, false);
        window.addEventListener("mousemove", this.onMouseMoveBinded, true);

        // Hide Panels and tools.
        Autodesk.Comments2.hidePanels(true, this.viewer);

        // exit other tools and hide HudMessages
        this.viewer.setActiveNavigationTool();
        Autodesk.Viewing.Private.HudMessage.dismiss();

        // Hide Panels and tools.
        Autodesk.Viewing.Extensions.Markers.hideToolsAndPanels(this.viewer);

        // Calculate node visibility table.
        this.nodeVisibilityTable = Autodesk.Viewing.Extensions.Markers.getNodeVisibilityTable(this.viewer);

        return true;
    };

    /**
     * Leave edit mode.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.leaveEditMode = function () {

        // Return if not in edit mode.
        if (!this.editMode) {
            return false;
        }

        this.clearSelection();

        // Remove edit frame div so input can be processed again by viewer and its tools and panels.
        this.editFrameDiv.parentNode.removeChild(this.editFrameDiv);
        this.editMode = false;

        window.removeEventListener("keydown", this.handleKeyDownBinded);
        window.removeEventListener("mousemove", this.onMouseMoveBinded, true);
        this.handleKeyDownBinded = null;

        // Restore toolbars and panels.
        Autodesk.Comments2.hidePanels(false, this.viewer);

        Autodesk.Viewing.Extensions.Markers.showToolsAndPanels(this.viewer);

        this.markers.update();
        return true;
    }

    /**
     * Leave edit mode and restores prior pintool to enter edit mode.
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.cancelEditMode = function () {

        // Return if not in edit mode.
        if (!this.leaveEditMode()) {
            return false;
        }

        // Restore previous pin position if drawing was canceled.
        return true;
    }

    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.updateGizmo = function (ctx) {

        function unproject(clientX, clientY, z, viewer) {

            var point = viewer.impl.clientToViewport(clientX, clientY);
            point.z = z;

            point.unproject(viewer.impl.camera);
            return point;
        }

        function getMouseRay(clientX, clientY, viewer) {

            var rayOrigin = unproject(clientX, clientY, -1, viewer);
            var rayDirection = unproject(clientX, clientY, 1, viewer);

            rayDirection.sub(rayOrigin);
            rayDirection.normalize();

            return new THREE.Ray(rayOrigin, rayDirection);
        }

        function getGizmoCollision(clientX, clientY, raycaster, viewer, gizmoCollision, nodeVisibilityTable) {

            var svf = viewer.model.getData();
            var modelIs2d = viewer.model.is2d();

            if (modelIs2d) {

                gizmoCollision.fragmentId = -1;
                gizmoCollision.point.set(0, 0, 0);

                var collision =  viewer.impl.intersectGround(clientX, clientY);
                if (collision) {

                    collision.z = 0;
                    var bbox = viewer.model.getData().bbox;
                    if (svf.hidePaper || bbox.containsPoint(collision)) {

                        gizmoCollision.point.copy(collision);
                        return true;
                    }
                }

                return false;

            } else {

                // Cast ray, if there is a collision creates the origin at collision distance.
                var ray = getMouseRay(clientX, clientY, viewer);
                raycaster.set(ray.origin, ray.direction);

                var renderQueue = viewer.impl.modelQueue();
                var result = renderQueue.rayIntersect(ray.origin, ray.direction, true);

                // var collisions = raycaster.intersectObjects(objects, false);
                if (!result) {
                    gizmoCollision.fragmentId = -1;
                    gizmoCollision.point.set(0, 0, 0);
                } else {
                    gizmoCollision.fragmentId = result[0];
                    gizmoCollision.point.copy(result[1]);
                }

                return gizmoCollision.fragmentId !== -1;
            }
        }

        // transform gizmo from 3d space to 2d client space.
        this.gizmoOverGeometry = getGizmoCollision(this.canvasX, this.canvasY, this.raycaster,
            this.viewer, this.gizmoCollision, this.nodeVisibilityTable);
        var gizmoColor = this.gizmoOverGeometry ? this.gizmoSuccessColor : this.gizmoInvalidColor;

        var x = this.canvasX + 0.5;
        var y = this.canvasY + 0.5;

        ctx.lineWidth = 1;
        ctx.globalAlpha = 1.00;
        Autodesk.Viewing.Extensions.Markers.drawLine(ctx, x, y, x, 0, gizmoColor);
        Autodesk.Viewing.Extensions.Markers.drawLine(ctx, x, y, x, 100000, gizmoColor);
        Autodesk.Viewing.Extensions.Markers.drawLine(ctx, x, y, 0, y, gizmoColor);
        Autodesk.Viewing.Extensions.Markers.drawLine(ctx, x, y, 100000, y, gizmoColor);
        ctx.globalAlpha = 1.0;

        Autodesk.Viewing.Extensions.Markers.drawCircle(ctx, x, y, 4, gizmoColor);
    };

    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.updateSelection = function () {

        this.hasSelection = this.gizmoOverGeometry;
        this.selectedNodeId = Autodesk.Comments2.LmvUtils.getNodeId(this.gizmoCollision.fragmentId, this.viewer);

        // Kind of a hack, markers uses getFragmentId to get the first fragment of a node id.
        // We made the same calculations that markers to place the gizmo, so we switch to the first fragment id for the node
        // id selected.
        var firstFragmentId = this.markers.getFragmentId(this.selectedNodeId);
        this.selectedNodeOffset = Autodesk.Viewing.Extensions.Markers.worldToNodeOffset(this.gizmoCollision.point, firstFragmentId, this.viewer);
        this.selectedFragmentId = firstFragmentId;
    };

    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.clearSelection = function () {

        this.selectedNodeId = -1;
        this.selectedNodeOffset.set(0, 0, 0);
        this.selectedFragmentId = -1;
        this.hasSelection = false;
    }

    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.updateSelectionMark = function (ctx) {

        if (!this.hasSelection) {
            return;
        }

        // transform mark to client space
        var worldOffset = this.selectedNodeOffset.clone();
        var fragmentId = this.selectedFragmentId;

        if (fragmentId != -1) {
            var fragProxy = this.viewer.impl.getFragmentProxy(this.viewer.model, fragmentId);
            var fragBB = new THREE.Box3();
            var world = new THREE.Matrix4();
            fragProxy.getWorldBounds(fragBB);
            fragProxy.getWorldMatrix(world);
            worldOffset.add(fragBB.center());
            worldOffset.applyMatrix4(world);
        }

        var transformedOffset = Autodesk.Viewing.Extensions.Markers.worldToClient(worldOffset, this.viewer);

        transformedOffset.x = Math.floor(transformedOffset.x) + 0.5;
        transformedOffset.y = Math.floor(transformedOffset.y) + 0.5;

        // draw mark
        Autodesk.Viewing.Extensions.Markers.drawCircle(ctx, transformedOffset.x, transformedOffset.y, 4, this.gizmoSuccessColor);
    }

    /**
     * Handler to mouse out events, used to hide gizmo when mouse is not over the tool.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.onMouseOut = function (event) {

        this.canvasX = -100000;
        this.canvasY = -100000;

        if (this.editMode) {
            this.markers.update();
        }
    }

    /**
     * Handler to mouse move events, used to create markups.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.onMouseMove = function (event) {

        if(event.target != this.editFrameDiv) {
            return;
        }

        event.stopPropagation();
        var mousePosition = Autodesk.Viewing.Extensions.Markers.getMousePosition(event);

        this.canvasX = mousePosition.x;
        this.canvasY = mousePosition.y;

        if (this.editMode) {
            this.markers.update();
        }
    }

    /**
     * Handler to mouse down events, used to start creation markups.
     * @param {MouseEvent} event Mouse event.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.onMouseDown = function (event) {

        var mousePosition = Autodesk.Viewing.Extensions.Markers.getMousePosition(event);

        this.canvasX = mousePosition.x;
        this.canvasY = mousePosition.y;

        this.updateSelection();

        if (this.editMode) {
            this.markers.update();
        }

        this.viewer.fireEvent({ type: this.EVENT_SELECTION_CHANGED, target: this });
    };

    /**
     * Returns markers extension.
     * @private
     */
    Autodesk.Viewing.Extensions.Markers.ViewerPinTool.prototype.__defineGetter__('markers', function () {
        return this.viewer.loadedExtensions['Autodesk.Comments2.Markers'];
    });

    /**
     * Register the extension with the extension manager.
     * @private
     */
    Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Comments2.PinTool', Autodesk.Viewing.Extensions.Markers.ViewerPinTool);
}
namespaceFunction('Autodesk.Viewing.Extensions.Markers');
namespaceFunction('Autodesk.Comments2');

Autodesk.Comments2.importViewerSelector = function() {

    Autodesk.Viewing.Extensions.Markers.ViewerSelector = function(viewer) {

        Autodesk.Viewing.Extension.call(this, viewer);
        this.EVENT_LEAVE_EDIT_MODE = "ViewerSelector_leave_edit_mode";
        this.EVENT_SELECTION_CHANGED = "ViewerSelector_selection_changed";
        var keyHandlerFunc;

        /**
         * Initializes the extension. Only supports Viewer3D instances.
         * @returns {boolean}
         */
        this.load = function () {
            // We only support Viewer3D. Bail out early if not.
            if (!(this.viewer instanceof Autodesk.Viewing.Viewer3D)) {
                return false;
            }

            var message = Autodesk.Comments2.Localization.objectSelect_message;
            this.editFrameDiv = Autodesk.Viewing.Extensions.Markers.createEditFrame(message, this.onCancel.bind(this));
            this.editFrameDiv.addEventListener("mousedown", this.onMouseDown.bind(this));
            this.editFrameDiv.addEventListener("keydown", this.handleKeyDown.bind(this));

            // Add members.
            this.editMode = false;
            this.selectedNodeId = -1;
            this.container = this.viewer.container;

            // Add to tool controller so we can get mouse events.
            this.raycaster = new THREE.Raycaster();

            return true;
        };

        this.handleKeyDown = function (event) {
            if (event.keyCode === Autodesk.Viewing.theHotkeyManager.KEYCODES.ESCAPE) {
                if (this.editMode) {
                    this.cancelEditMode();
                    this.viewer.fireEvent({ type: this.EVENT_LEAVE_EDIT_MODE, target: this });
                }
            }
        };

        this.unproject = function (clientX, clientY, z) {

            var point = this.viewer.impl.clientToViewport(clientX, clientY);
            point.z = z;

            point.unproject(this.viewer.impl.camera);
            return point;
        };

        this.getMouseRay = function (clientX, clientY) {
            var rayOrigin = this.unproject(clientX, clientY, -1);
            var rayDirection = this.unproject(clientX, clientY, 1);

            rayDirection.sub(rayOrigin);
            rayDirection.normalize();

            return new THREE.Ray(rayOrigin, rayDirection);
        };

        this.onCancel = function () {
            this.cancelEditMode();
            this.viewer.fireEvent({ type: this.EVENT_LEAVE_EDIT_MODE, target: this });
        };

        this.onMouseDown = function (event) {

            var mousePosition = Autodesk.Viewing.Extensions.Markers.getMousePosition(event);
            var clientX = mousePosition.x;
            var clientY = mousePosition.y;

            var currSelectNodeId = this.selectedNodeId;

            // Cast ray, if there is a collision creates the origin at collision distance.
            var ray = this.getMouseRay(clientX, clientY, viewer);
            var renderQueue = this.viewer.impl.modelQueue();
            var result = renderQueue.rayIntersect(ray.origin, ray.direction, true);

            if (!result) {

                this.selectedNodeId = -1;
                this.viewer.clearSelection();
            } else {

                var nodeId = Autodesk.Comments2.LmvUtils.getNodeId(result[0], this.viewer);
                this.viewer.clearSelection();
                if (nodeId === this.selectedNodeId) {
                    this.selectedNodeId = -1;
                } else {
                    this.selectedNodeId = nodeId;
                    Autodesk.Comments2.LmvUtils.setSelection(this.viewer, [nodeId]);
                }
            }

            if (currSelectNodeId !== this.selectedNodeId) {
                this.viewer.fireEvent({ type: this.EVENT_SELECTION_CHANGED, target: this });
            }
        };

        this.unload = function () {
            this.cancelEditMode();
            // Remove div
            if (this.editFrameDiv.parentNode) {
                this.editFrameDiv.parentNode.removeChild(this.editFrameDiv);
            }
            return true;
        };

        this.enterEditMode = function () {

            // Return if there is no viewer nor model.
            if (!this.viewer || !this.viewer.model) {
                return;
            }

            // Return if already in edit mode.
            if (this.editMode) {
                return;
            }

            this.editMode = true;
            this.selectedNodeId = -1;
            this.viewer.clearSelection();

            keyHandlerFunc = this.handleKeyDown.bind(this);
            window.addEventListener("keydown", keyHandlerFunc, false);

            // Add edit frame div at the top of all extensions and tools, all user interaction with the viewer is suspende
            // until user selects a point.
            this.container.appendChild(this.editFrameDiv);

            // Hide Panels and tools.
            Autodesk.Comments2.hidePanels(true, this.viewer);

            // exit other tools and hide HudMessages
            this.viewer.setActiveNavigationTool();
            Autodesk.Viewing.Private.HudMessage.dismiss();

            // Hide Panels and tools.
            Autodesk.Viewing.Extensions.Markers.hideToolsAndPanels(this.viewer);
        };

        this.leaveEditMode = function () {
            // Return if not in edit mode.
            if (!this.editMode) {
                return false;
            }

            // Remove edit frame div so input can be processed again by viewer and its tools and panels.
            this.editFrameDiv.parentNode.removeChild(this.editFrameDiv);
            this.editMode = false;

            window.removeEventListener("keydown", keyHandlerFunc);
            keyHandlerFunc = null;

            // Restore toolbars and panels.
            Autodesk.Comments2.hidePanels(false, this.viewer);

            Autodesk.Viewing.Extensions.Markers.showToolsAndPanels(this.viewer);
            return true;
        };

        this.cancelEditMode = function () {
            if (this.selectedNodeId !== -1) {
                this.selectedNodeId = -1;
                this.viewer.clearSelection();
            }
            this.leaveEditMode();
        };
    }

    Autodesk.Viewing.Extensions.Markers.ViewerSelector.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
    Autodesk.Viewing.Extensions.Markers.ViewerSelector.prototype.constructor = Autodesk.Viewing.Extensions.Markers.ViewerSelector;

    /**
     * Register the extension with the extension manager.
     * @private
     */
    Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.Comments2.ViewerSelector', Autodesk.Viewing.Extensions.Markers.ViewerSelector);
}