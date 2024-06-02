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
                    <a href="index.html" data-type="index-link">api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
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
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthenticationModule.html" data-type="entity-link" >AuthenticationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' : 'data-bs-target="#xs-controllers-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' :
                                            'id="xs-controllers-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' }>
                                            <li class="link">
                                                <a href="controllers/AuthenticationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' : 'data-bs-target="#xs-injectables-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' :
                                        'id="xs-injectables-links-module-AuthenticationModule-8e6d7747ae4e5746ff2f0d235ec805b0cdc835bf4a13b4f233d5a030bede70302f4a3b6f5b4f875b4fe51b63d542e3bfa9a56cb0fb33396b3d837dfec9ac8294"' }>
                                        <li class="link">
                                            <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CryptoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CryptoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DateService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RefreshTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RefreshTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenWhitelistService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenWhitelistService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MilestoneEstimateModule.html" data-type="entity-link" >MilestoneEstimateModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' : 'data-bs-target="#xs-controllers-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' :
                                            'id="xs-controllers-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' }>
                                            <li class="link">
                                                <a href="controllers/MilestoneEstimateController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MilestoneEstimateController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' : 'data-bs-target="#xs-injectables-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' :
                                        'id="xs-injectables-links-module-MilestoneEstimateModule-8a4747f6f8b79819ddfd5a9a53b51f1cd1a0aeb7cfb8b1b38bd57452efd3eaf88cf887d7304ac2af6b8bfa082168ef9199b1a113d31a0802a34ace1eea510338"' }>
                                        <li class="link">
                                            <a href="injectables/MilestoneEstimateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MilestoneEstimateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProfileModule-dec876b8cbc7d911e0fc6cf0979ebb8a662166a34233644a086c0948416fb51ad546fb3b59f866b32473419160987a5a21863f44f129963ffe8ba6bda3899a91"' : 'data-bs-target="#xs-controllers-links-module-ProfileModule-dec876b8cbc7d911e0fc6cf0979ebb8a662166a34233644a086c0948416fb51ad546fb3b59f866b32473419160987a5a21863f44f129963ffe8ba6bda3899a91"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-dec876b8cbc7d911e0fc6cf0979ebb8a662166a34233644a086c0948416fb51ad546fb3b59f866b32473419160987a5a21863f44f129963ffe8ba6bda3899a91"' :
                                            'id="xs-controllers-links-module-ProfileModule-dec876b8cbc7d911e0fc6cf0979ebb8a662166a34233644a086c0948416fb51ad546fb3b59f866b32473419160987a5a21863f44f129963ffe8ba6bda3899a91"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectMemberModule.html" data-type="entity-link" >ProjectMemberModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' : 'data-bs-target="#xs-controllers-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' :
                                            'id="xs-controllers-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectMemberController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMemberController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' : 'data-bs-target="#xs-injectables-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' :
                                        'id="xs-injectables-links-module-ProjectMemberModule-da1d1503af196537af905c482a1653d0961fb5b74f458a9bcc7ba38691cb882253dbd2e8f8713062c7351133ce9812e968439470af3d894ed7c16b091e3f2bf3"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectMemberService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMemberService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectMilestoneModule.html" data-type="entity-link" >ProjectMilestoneModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' : 'data-bs-target="#xs-controllers-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' :
                                            'id="xs-controllers-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectMilestoneController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMilestoneController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' : 'data-bs-target="#xs-injectables-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' :
                                        'id="xs-injectables-links-module-ProjectMilestoneModule-9156ad35b2c211eb1699934659a29b16b15e775ca8719200fd971157e75b57799e4ea5b6b432e1cfade3343417ec9d96be02ef6965a17650576bc63c1ab0b397"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectMilestoneService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMilestoneService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectModule.html" data-type="entity-link" >ProjectModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' : 'data-bs-target="#xs-controllers-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' :
                                            'id="xs-controllers-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' : 'data-bs-target="#xs-injectables-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' :
                                        'id="xs-injectables-links-module-ProjectModule-65c8d2f0899c0f16e2372c92232b4fe79ceee3f92463db01f75b47b2be3cdec6ac06e9878afa3144a6e5699f0ceade02b04ab92dcdc9bec5aedcb178b4061b88"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectMemberService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMemberService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProjectMilestoneService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMilestoneService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProjectService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectReportModule.html" data-type="entity-link" >ProjectReportModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' : 'data-bs-target="#xs-controllers-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' :
                                            'id="xs-controllers-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectReportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectReportController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' : 'data-bs-target="#xs-injectables-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' :
                                        'id="xs-injectables-links-module-ProjectReportModule-8a8abf97a58915f6e4a3d069b9fb39b868eccffb2a6734ace5bba59523a2273a5757c0eefff1c15b9198def55bd336dfb56a3072c8a5790a0cfd2569881834c3"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectReportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectReportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ServicesModule.html" data-type="entity-link" >ServicesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ServicesModule-0f17c9855aedcc7bd19be8b3712eb56c0ff72121eab2207f87555a7818a94d6c921c241dc825e0e15b3a943e017ccaa9618e38322e7848adc1f5d0be8378488d"' : 'data-bs-target="#xs-injectables-links-module-ServicesModule-0f17c9855aedcc7bd19be8b3712eb56c0ff72121eab2207f87555a7818a94d6c921c241dc825e0e15b3a943e017ccaa9618e38322e7848adc1f5d0be8378488d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ServicesModule-0f17c9855aedcc7bd19be8b3712eb56c0ff72121eab2207f87555a7818a94d6c921c241dc825e0e15b3a943e017ccaa9618e38322e7848adc1f5d0be8378488d"' :
                                        'id="xs-injectables-links-module-ServicesModule-0f17c9855aedcc7bd19be8b3712eb56c0ff72121eab2207f87555a7818a94d6c921c241dc825e0e15b3a943e017ccaa9618e38322e7848adc1f5d0be8378488d"' }>
                                        <li class="link">
                                            <a href="injectables/CryptoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CryptoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' : 'data-bs-target="#xs-controllers-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' :
                                            'id="xs-controllers-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' : 'data-bs-target="#xs-injectables-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' :
                                        'id="xs-injectables-links-module-UserModule-ec240ba5e6297570941f5fee0e56ce558dcc5dc0517bc6797c2703204bddf8e02fa2823883734fa389f34ea956ec58baf01a0df90fa06bc63fe6e40747c73acd"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthenticationController.html" data-type="entity-link" >AuthenticationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MilestoneEstimateController.html" data-type="entity-link" >MilestoneEstimateController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProfileController.html" data-type="entity-link" >ProfileController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProjectController.html" data-type="entity-link" >ProjectController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProjectMemberController.html" data-type="entity-link" >ProjectMemberController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProjectMilestoneController.html" data-type="entity-link" >ProjectMilestoneController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProjectReportController.html" data-type="entity-link" >ProjectReportController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/MilestoneEstimate.html" data-type="entity-link" >MilestoneEstimate</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Project.html" data-type="entity-link" >Project</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectMember.html" data-type="entity-link" >ProjectMember</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectMilestone.html" data-type="entity-link" >ProjectMilestone</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProjectReport.html" data-type="entity-link" >ProjectReport</a>
                                </li>
                                <li class="link">
                                    <a href="entities/TokenWhitelist.html" data-type="entity-link" >TokenWhitelist</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
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
                                <a href="classes/AllExceptionsFilter.html" data-type="entity-link" >AllExceptionsFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/BadRequestException.html" data-type="entity-link" >BadRequestException</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntityWithExtras.html" data-type="entity-link" >BaseEntityWithExtras</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseException.html" data-type="entity-link" >BaseException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IncorrectCredentialsException.html" data-type="entity-link" >IncorrectCredentialsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoAffectedRowException.html" data-type="entity-link" >NoAffectedRowException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectMemberInvitePendingDefault1717365845661.html" data-type="entity-link" >ProjectMemberInvitePendingDefault1717365845661</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjektarbeitAPI1711999577974.html" data-type="entity-link" >ProjektarbeitAPI1711999577974</a>
                            </li>
                            <li class="link">
                                <a href="classes/StoredProcedureAndEvent1711999597974.html" data-type="entity-link" >StoredProcedureAndEvent1711999597974</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnauthorizedException.html" data-type="entity-link" >UnauthorizedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAcademicTitle1714254731674.html" data-type="entity-link" >UserAcademicTitle1714254731674</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAlreadyExistsException.html" data-type="entity-link" >UserAlreadyExistsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDoesNotExistException.html" data-type="entity-link" >UserDoesNotExistException</a>
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
                                    <a href="injectables/AccessTokenGuard.html" data-type="entity-link" >AccessTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" >AccessTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CryptoService.html" data-type="entity-link" >CryptoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateService.html" data-type="entity-link" >DateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MilestoneEstimateService.html" data-type="entity-link" >MilestoneEstimateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectMemberService.html" data-type="entity-link" >ProjectMemberService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectMilestoneService.html" data-type="entity-link" >ProjectMilestoneService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectReportService.html" data-type="entity-link" >ProjectReportService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectService.html" data-type="entity-link" >ProjectService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenGuard.html" data-type="entity-link" >RefreshTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefreshTokenStrategy.html" data-type="entity-link" >RefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenWhitelistService.html" data-type="entity-link" >TokenWhitelistService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
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