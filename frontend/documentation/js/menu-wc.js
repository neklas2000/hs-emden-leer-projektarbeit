'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">frontend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmationDialogComponent.html" data-type="entity-link" >ConfirmationDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditCredentialsComponent.html" data-type="entity-link" >EditCredentialsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditMilestoneEstimatesComponent.html" data-type="entity-link" >EditMilestoneEstimatesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditMilestoneEstimatesTabComponent.html" data-type="entity-link" >EditMilestoneEstimatesTabComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditPersonalInformationComponent.html" data-type="entity-link" >EditPersonalInformationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditProjectComponent.html" data-type="entity-link" >EditProjectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditReportComponent.html" data-type="entity-link" >EditReportComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomeComponent.html" data-type="entity-link" >HomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InviteProjectMemberDialogComponent.html" data-type="entity-link" >InviteProjectMemberDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayoutComponent.html" data-type="entity-link" >LayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LogoComponent.html" data-type="entity-link" >LogoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MarkdownEditorComponent.html" data-type="entity-link" >MarkdownEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MarkdownEditorDialogComponent.html" data-type="entity-link" >MarkdownEditorDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MilestoneTrendAnalysisChartComponent.html" data-type="entity-link" >MilestoneTrendAnalysisChartComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewMilestoneDialogComponent.html" data-type="entity-link" >NewMilestoneDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewProjectComponent.html" data-type="entity-link" >NewProjectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewReportComponent.html" data-type="entity-link" >NewReportComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileComponent.html" data-type="entity-link" >ProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectDetailsComponent.html" data-type="entity-link" >ProjectDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectsComponent.html" data-type="entity-link" >ProjectsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterCredentialsComponent.html" data-type="entity-link" >RegisterCredentialsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterPersonalDetailsComponent.html" data-type="entity-link" >RegisterPersonalDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReportDetailsComponent.html" data-type="entity-link" >ReportDetailsComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BaseModel.html" data-type="entity-link" >BaseModel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Categories.html" data-type="entity-link" >Categories</a>
                            </li>
                            <li class="link">
                                <a href="classes/Categories-1.html" data-type="entity-link" >Categories</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormValidators.html" data-type="entity-link" >FormValidators</a>
                            </li>
                            <li class="link">
                                <a href="classes/FreeMarkers.html" data-type="entity-link" >FreeMarkers</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpException.html" data-type="entity-link" >HttpException</a>
                            </li>
                            <li class="link">
                                <a href="classes/JsonApiConnectorService.html" data-type="entity-link" >JsonApiConnectorService</a>
                            </li>
                            <li class="link">
                                <a href="classes/MilestoneEstimate.html" data-type="entity-link" >MilestoneEstimate</a>
                            </li>
                            <li class="link">
                                <a href="classes/Project.html" data-type="entity-link" >Project</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectMember.html" data-type="entity-link" >ProjectMember</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectMilestone.html" data-type="entity-link" >ProjectMilestone</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectReport.html" data-type="entity-link" >ProjectReport</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tupel.html" data-type="entity-link" >Tupel</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AgChartService.html" data-type="entity-link" >AgChartService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ChartService.html" data-type="entity-link" >ChartService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateService.html" data-type="entity-link" >DateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JsonApiDatastore.html" data-type="entity-link" >JsonApiDatastore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MediaMatching.html" data-type="entity-link" >MediaMatching</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PdfService.html" data-type="entity-link" >PdfService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfileService.html" data-type="entity-link" >ProfileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectReportSchema.html" data-type="entity-link" >ProjectReportSchema</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectReportService.html" data-type="entity-link" >ProjectReportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectService.html" data-type="entity-link" >ProjectService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SessionStorageService.html" data-type="entity-link" >SessionStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SnackbarService.html" data-type="entity-link" >SnackbarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThemeService.html" data-type="entity-link" >ThemeService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/PdfSchema.html" data-type="entity-link" >PdfSchema</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/UndefinedStringPipe.html" data-type="entity-link" >UndefinedStringPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});