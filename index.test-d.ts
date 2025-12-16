import { expectType, expectError, expectAssignable } from "tsd";
import * as ejs from "./index";

// =============================================================================
// Module exports
// =============================================================================

expectType<string>(ejs.VERSION);
expectType<"ejs">(ejs.name);

// =============================================================================
// resolveInclude
// =============================================================================

expectType<string>(ejs.resolveInclude("partial", "/views/index.ejs"));
expectType<string>(ejs.resolveInclude("partial", "/views", true));

// =============================================================================
// compile
// =============================================================================

// Basic compile returns TemplateFunction
const templateFn = ejs.compile("<%= foo %>");
expectType<ejs.TemplateFunction>(templateFn);
expectType<string>(templateFn({ foo: "bar" }));

// Async compile returns AsyncTemplateFunction
const asyncTemplateFn = ejs.compile("<%= foo %>", { async: true });
expectType<ejs.AsyncTemplateFunction>(asyncTemplateFn);
expectType<Promise<string>>(asyncTemplateFn({ foo: "bar" }));

// Client compile returns ClientFunction
const clientFn = ejs.compile("<%= foo %>", { client: true });
expectType<ejs.ClientFunction>(clientFn);
expectType<string>(clientFn({ foo: "bar" }));

// Async client compile returns AsyncClientFunction
const asyncClientFn = ejs.compile("<%= foo %>", { async: true, client: true });
expectType<ejs.AsyncClientFunction>(asyncClientFn);
expectType<Promise<string>>(asyncClientFn({ foo: "bar" }));

// =============================================================================
// render
// =============================================================================

// Basic render returns string
expectType<string>(ejs.render("<%= foo %>", { foo: "bar" }));

// Async render returns Promise<string>
expectType<Promise<string>>(
  ejs.render("<%= foo %>", { foo: "bar" }, { async: true })
);

// Explicit async: false returns string
expectType<string>(ejs.render("<%= foo %>", { foo: "bar" }, { async: false }));

// =============================================================================
// renderFile
// =============================================================================

// With callback
ejs.renderFile("/path/to/file.ejs", (err, str) => {
  expectType<Error | null>(err);
  expectType<string>(str);
});

ejs.renderFile("/path/to/file.ejs", { foo: "bar" }, (err, str) => {
  expectType<Error | null>(err);
  expectType<string>(str);
});

ejs.renderFile("/path/to/file.ejs", { foo: "bar" }, {}, (err, str) => {
  expectType<Error | null>(err);
  expectType<string>(str);
});

// Without callback returns Promise
expectType<Promise<string>>(ejs.renderFile("/path/to/file.ejs"));
expectType<Promise<string>>(ejs.renderFile("/path/to/file.ejs", { foo: "bar" }));
expectType<Promise<string>>(
  ejs.renderFile("/path/to/file.ejs", { foo: "bar" }, {})
);

// =============================================================================
// clearCache
// =============================================================================

expectType<void>(ejs.clearCache());

// =============================================================================
// cache
// =============================================================================

expectAssignable<ejs.Cache>(ejs.cache);
ejs.cache.set("key", templateFn);
expectType<ejs.TemplateFunction | undefined>(ejs.cache.get("key"));
ejs.cache.reset();

// =============================================================================
// fileLoader
// =============================================================================

expectAssignable<ejs.fileLoader>(ejs.fileLoader);
const customLoader: ejs.fileLoader = (path) => `loaded: ${path}`;
// Note: Assignment works at runtime (CommonJS) but not via ES module namespace
expectAssignable<ejs.fileLoader>(customLoader);

// =============================================================================
// Module-level settings
// =============================================================================

expectType<string>(ejs.localsName);
expectType<string>(ejs.openDelimiter);
expectType<string>(ejs.closeDelimiter);
expectType<string | undefined>(ejs.delimiter);
expectType<PromiseConstructorLike | undefined>(ejs.promiseImpl);

// =============================================================================
// escapeXML
// =============================================================================

expectType<string>(ejs.escapeXML("<div>"));
expectType<string>(ejs.escapeXML(undefined));
expectType<string>(ejs.escapeXML(null));

// =============================================================================
// Template class
// =============================================================================

const template = new ejs.Template("<%= foo %>");
expectType<string>(template.templateText);
expectType<string>(template.source);
expectType<
  | ejs.TemplateFunction
  | ejs.AsyncTemplateFunction
  | ejs.ClientFunction
  | ejs.AsyncClientFunction
>(template.compile());

// Template modes enum - verify enum values are assignable to modes type
const evalMode: ejs.Template.modes = ejs.Template.modes.EVAL;
const escapedMode: ejs.Template.modes = ejs.Template.modes.ESCAPED;
const rawMode: ejs.Template.modes = ejs.Template.modes.RAW;
const commentMode: ejs.Template.modes = ejs.Template.modes.COMMENT;
const literalMode: ejs.Template.modes = ejs.Template.modes.LITERAL;

// Verify modes can be used as strings
expectAssignable<string>(ejs.Template.modes.EVAL);
expectAssignable<string>(ejs.Template.modes.ESCAPED);
expectAssignable<string>(ejs.Template.modes.RAW);
expectAssignable<string>(ejs.Template.modes.COMMENT);
expectAssignable<string>(ejs.Template.modes.LITERAL);

// =============================================================================
// Options
// =============================================================================

const options: ejs.Options = {
  debug: false,
  compileDebug: true,
  _with: true,
  strict: false,
  destructuredLocals: ["foo", "bar"],
  rmWhitespace: false,
  client: false,
  escape: (markup) => String(markup),
  escapeFunction: (markup) => String(markup),
  filename: "/path/to/file.ejs",
  root: "/views",
  openDelimiter: "<",
  closeDelimiter: ">",
  delimiter: "%",
  cache: false,
  context: {},
  async: false,
  beautify: true,
  localsName: "locals",
  outputFunctionName: "echo",
  views: ["/views"],
  includer: (originalPath, parsedPath) => ({ filename: parsedPath }),
  legacyInclude: true,
};

expectAssignable<ejs.Options>(options);

// Root can be array
const optionsWithArrayRoot: ejs.Options = {
  root: ["/views", "/templates"],
};
expectAssignable<ejs.Options>(optionsWithArrayRoot);

// =============================================================================
// Callback types
// =============================================================================

const escapeCallback: ejs.EscapeCallback = (markup) => String(markup ?? "");
expectType<string>(escapeCallback("<div>"));

const includeCallback: ejs.IncludeCallback = (path, data) => "included content";
expectType<string>(includeCallback("partial", { foo: "bar" }));

const includerCallback: ejs.IncluderCallback = (originalPath, parsedPath) => ({
  filename: parsedPath,
});
expectAssignable<ejs.IncluderResult>(includerCallback("partial", "/full/path"));

// IncluderResult variants
const includerResultFilename: ejs.IncluderResult = { filename: "/path" };
const includerResultTemplate: ejs.IncluderResult = { template: "<%= foo %>" };
expectAssignable<ejs.IncluderResult>(includerResultFilename);
expectAssignable<ejs.IncluderResult>(includerResultTemplate);

// =============================================================================
// __express (Express.js support)
// =============================================================================

// __express is an alias for renderFile
expectType<typeof ejs.renderFile>(ejs.__express);

// =============================================================================
// Data type
// =============================================================================

const data: ejs.Data = {
  foo: "bar",
  nested: { baz: 123 },
  array: [1, 2, 3],
};
expectAssignable<ejs.Data>(data);
