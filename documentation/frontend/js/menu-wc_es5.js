'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _wrapNativeSuper(t) { var r = "function" == typeof Map ? new Map() : void 0; return _wrapNativeSuper = function _wrapNativeSuper(t) { if (null === t || !_isNativeFunction(t)) return t; if ("function" != typeof t) throw new TypeError("Super expression must either be null or a function"); if (void 0 !== r) { if (r.has(t)) return r.get(t); r.set(t, Wrapper); } function Wrapper() { return _construct(t, arguments, _getPrototypeOf(this).constructor); } return Wrapper.prototype = Object.create(t.prototype, { constructor: { value: Wrapper, enumerable: !1, writable: !0, configurable: !0 } }), _setPrototypeOf(Wrapper, t); }, _wrapNativeSuper(t); }
function _construct(t, e, r) { if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments); var o = [null]; o.push.apply(o, e); var p = new (t.bind.apply(t, o))(); return r && _setPrototypeOf(p, r.prototype), p; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _isNativeFunction(t) { try { return -1 !== Function.toString.call(t).indexOf("[native code]"); } catch (n) { return "function" == typeof t; } }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
customElements.define('compodoc-menu', /*#__PURE__*/function (_HTMLElement) {
  function _class() {
    var _this;
    _classCallCheck(this, _class);
    _this = _callSuper(this, _class);
    _this.isNormalMode = _this.getAttribute('mode') === 'normal';
    return _this;
  }
  _inherits(_class, _HTMLElement);
  return _createClass(_class, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.render(this.isNormalMode);
    }
  }, {
    key: "render",
    value: function render(isNormalMode) {
      var tp = lithtml.html("\n        <nav>\n            <ul class=\"list\">\n                <li class=\"title\">\n                    <a href=\"index.html\" data-type=\"index-link\">Frontend Dokumentation</a>\n                </li>\n\n                <li class=\"divider\"></li>\n                ".concat(isNormalMode ? "<div id=\"book-search-input\" role=\"search\"><input type=\"text\" placeholder=\"Type to search\"></div>" : '', "\n                <li class=\"chapter\">\n                    <a data-type=\"chapter-link\" href=\"index.html\"><span class=\"icon ion-ios-home\"></span>Getting started</a>\n                    <ul class=\"links\">\n                        <li class=\"link\">\n                            <a href=\"overview.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-keypad\"></span>Overview\n                            </a>\n                        </li>\n                        <li class=\"link\">\n                            <a href=\"index.html\" data-type=\"chapter-link\">\n                                <span class=\"icon ion-ios-paper\"></span>README\n                            </a>\n                        </li>\n                                <li class=\"link\">\n                                    <a href=\"dependencies.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-list\"></span>Dependencies\n                                    </a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"properties.html\" data-type=\"chapter-link\">\n                                        <span class=\"icon ion-ios-apps\"></span>Properties\n                                    </a>\n                                </li>\n                    </ul>\n                </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#components-links"' : 'data-bs-target="#xs-components-links"', ">\n                            <span class=\"icon ion-md-cog\"></span>\n                            <span>Components</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="components-links"' : 'id="xs-components-links"', ">\n                            <li class=\"link\">\n                                <a href=\"components/AppComponent.html\" data-type=\"entity-link\" >AppComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/AuthComponent.html\" data-type=\"entity-link\" >AuthComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ConfirmMilestoneDeletionComponent.html\" data-type=\"entity-link\" >ConfirmMilestoneDeletionComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ConfirmMilestoneEstimateDeletionComponent.html\" data-type=\"entity-link\" >ConfirmMilestoneEstimateDeletionComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ConfirmProfileDeletionComponent.html\" data-type=\"entity-link\" >ConfirmProfileDeletionComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ConfirmProjectDeletionComponent.html\" data-type=\"entity-link\" >ConfirmProjectDeletionComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ConfirmProjectMemberRemovalComponent.html\" data-type=\"entity-link\" >ConfirmProjectMemberRemovalComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/CreateNewMilestoneComponent.html\" data-type=\"entity-link\" >CreateNewMilestoneComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/CustomSnackBarComponent.html\" data-type=\"entity-link\" >CustomSnackBarComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/EditCredentialsComponent.html\" data-type=\"entity-link\" >EditCredentialsComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/EditMilestoneEstimatesComponent.html\" data-type=\"entity-link\" >EditMilestoneEstimatesComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/EditMilestoneEstimatesTabComponent.html\" data-type=\"entity-link\" >EditMilestoneEstimatesTabComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/EditPersonalInformationComponent.html\" data-type=\"entity-link\" >EditPersonalInformationComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/EditProjectComponent.html\" data-type=\"entity-link\" >EditProjectComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/EditReportComponent.html\" data-type=\"entity-link\" >EditReportComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/HomeComponent.html\" data-type=\"entity-link\" >HomeComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/InfoBoxComponent.html\" data-type=\"entity-link\" >InfoBoxComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/InviteProjectMemberComponent.html\" data-type=\"entity-link\" >InviteProjectMemberComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/LayoutComponent.html\" data-type=\"entity-link\" >LayoutComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/LoginComponent.html\" data-type=\"entity-link\" >LoginComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/LogoComponent.html\" data-type=\"entity-link\" >LogoComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/MarkdownEditorComponent.html\" data-type=\"entity-link\" >MarkdownEditorComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/MarkdownProvideExternalUrlComponent.html\" data-type=\"entity-link\" >MarkdownProvideExternalUrlComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/MilestoneTrendAnalysisChartComponent.html\" data-type=\"entity-link\" >MilestoneTrendAnalysisChartComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/NewProjectComponent.html\" data-type=\"entity-link\" >NewProjectComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/NewReportComponent.html\" data-type=\"entity-link\" >NewReportComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/PageNotFoundComponent.html\" data-type=\"entity-link\" >PageNotFoundComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ProfileComponent.html\" data-type=\"entity-link\" >ProfileComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ProjectDetailsComponent.html\" data-type=\"entity-link\" >ProjectDetailsComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ProjectsComponent.html\" data-type=\"entity-link\" >ProjectsComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/RegisterComponent.html\" data-type=\"entity-link\" >RegisterComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/RegisterCredentialsComponent.html\" data-type=\"entity-link\" >RegisterCredentialsComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/RegisterPersonalDetailsComponent.html\" data-type=\"entity-link\" >RegisterPersonalDetailsComponent</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"components/ReportDetailsComponent.html\" data-type=\"entity-link\" >ReportDetailsComponent</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#classes-links"' : 'data-bs-target="#xs-classes-links"', ">\n                            <span class=\"icon ion-ios-paper\"></span>\n                            <span>Classes</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"', ">\n                            <li class=\"link\">\n                                <a href=\"classes/ChartCategories.html\" data-type=\"entity-link\" >ChartCategories</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/FormValidators.html\" data-type=\"entity-link\" >FormValidators</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/HttpException.html\" data-type=\"entity-link\" >HttpException</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/JsonApiConnectorService.html\" data-type=\"entity-link\" >JsonApiConnectorService</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"classes/UUID.html\" data-type=\"entity-link\" >UUID</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#injectables-links"' : 'data-bs-target="#xs-injectables-links"', ">\n                                <span class=\"icon ion-md-arrow-round-down\"></span>\n                                <span>Injectables</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"injectables/AgChartService.html\" data-type=\"entity-link\" >AgChartService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/AuthenticationService.html\" data-type=\"entity-link\" >AuthenticationService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/DateService.html\" data-type=\"entity-link\" >DateService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/DialogService.html\" data-type=\"entity-link\" >DialogService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/MediaMatching.html\" data-type=\"entity-link\" >MediaMatching</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/MilestoneEstimateService.html\" data-type=\"entity-link\" >MilestoneEstimateService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/NotFoundService.html\" data-type=\"entity-link\" >NotFoundService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/PdfMakeProviderService.html\" data-type=\"entity-link\" >PdfMakeProviderService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/PdfService.html\" data-type=\"entity-link\" >PdfService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ProfileService.html\" data-type=\"entity-link\" >ProfileService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ProjectMemberService.html\" data-type=\"entity-link\" >ProjectMemberService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ProjectMilestoneService.html\" data-type=\"entity-link\" >ProjectMilestoneService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ProjectReportSchema.html\" data-type=\"entity-link\" >ProjectReportSchema</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ProjectReportService.html\" data-type=\"entity-link\" >ProjectReportService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ProjectService.html\" data-type=\"entity-link\" >ProjectService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/SessionStorageService.html\" data-type=\"entity-link\" >SessionStorageService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/SnackbarService.html\" data-type=\"entity-link\" >SnackbarService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/ThemeService.html\" data-type=\"entity-link\" >ThemeService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/UserService.html\" data-type=\"entity-link\" >UserService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/UtilityProviderService.html\" data-type=\"entity-link\" >UtilityProviderService</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"injectables/WindowProviderService.html\" data-type=\"entity-link\" >WindowProviderService</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#interceptors-links"' : 'data-bs-target="#xs-interceptors-links"', ">\n                            <span class=\"icon ion-ios-swap\"></span>\n                            <span>Interceptors</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interceptors/AuthenticationInterceptor.html\" data-type=\"entity-link\" >AuthenticationInterceptor</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#interfaces-links"' : 'data-bs-target="#xs-interfaces-links"', ">\n                            <span class=\"icon ion-md-information-circle-outline\"></span>\n                            <span>Interfaces</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"', ">\n                            <li class=\"link\">\n                                <a href=\"interfaces/PdfSchema.html\" data-type=\"entity-link\" >PdfSchema</a>\n                            </li>\n                        </ul>\n                    </li>\n                        <li class=\"chapter\">\n                            <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#pipes-links"' : 'data-bs-target="#xs-pipes-links"', ">\n                                <span class=\"icon ion-md-add\"></span>\n                                <span>Pipes</span>\n                                <span class=\"icon ion-ios-arrow-down\"></span>\n                            </div>\n                            <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"', ">\n                                <li class=\"link\">\n                                    <a href=\"pipes/FullTitleNamePipe.html\" data-type=\"entity-link\" >FullTitleNamePipe</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"pipes/ProjectTypePipe.html\" data-type=\"entity-link\" >ProjectTypePipe</a>\n                                </li>\n                                <li class=\"link\">\n                                    <a href=\"pipes/UndefinedStringPipe.html\" data-type=\"entity-link\" >UndefinedStringPipe</a>\n                                </li>\n                            </ul>\n                        </li>\n                    <li class=\"chapter\">\n                        <div class=\"simple menu-toggler\" data-bs-toggle=\"collapse\" ").concat(isNormalMode ? 'data-bs-target="#miscellaneous-links"' : 'data-bs-target="#xs-miscellaneous-links"', ">\n                            <span class=\"icon ion-ios-cube\"></span>\n                            <span>Miscellaneous</span>\n                            <span class=\"icon ion-ios-arrow-down\"></span>\n                        </div>\n                        <ul class=\"links collapse \" ").concat(isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"', ">\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/enumerations.html\" data-type=\"entity-link\">Enums</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/functions.html\" data-type=\"entity-link\">Functions</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/typealiases.html\" data-type=\"entity-link\">Type aliases</a>\n                            </li>\n                            <li class=\"link\">\n                                <a href=\"miscellaneous/variables.html\" data-type=\"entity-link\">Variables</a>\n                            </li>\n                        </ul>\n                    </li>\n                    <li class=\"chapter\">\n                        <a data-type=\"chapter-link\" href=\"coverage.html\"><span class=\"icon ion-ios-stats\"></span>Documentation coverage</a>\n                    </li>\n                    <li class=\"divider\"></li>\n                    <li class=\"copyright\">\n                        Documentation generated using <a href=\"https://compodoc.app/\" target=\"_blank\" rel=\"noopener noreferrer\">\n                            <img data-src=\"images/compodoc-vectorise.png\" class=\"img-responsive\" data-type=\"compodoc-logo\">\n                        </a>\n                    </li>\n            </ul>\n        </nav>\n        "));
      this.innerHTML = tp.strings;
    }
  }]);
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement)));