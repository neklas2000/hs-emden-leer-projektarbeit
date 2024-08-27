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
                    <a href="index.html" data-type="index-link">API Dokumentation</a>
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
                                            'data-bs-target="#controllers-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' : 'data-bs-target="#xs-controllers-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' :
                                            'id="xs-controllers-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' }>
                                            <li class="link">
                                                <a href="controllers/AuthenticationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' : 'data-bs-target="#xs-injectables-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' :
                                        'id="xs-injectables-links-module-AuthenticationModule-195c36175b32f1dc7ec9bcc6c9950e96ec0bf5049ca91780af6ab84ceaa7796b9119776229890b35784b7cbf6377b8b6ca5b4ba310957c33c8959040a5c1846b"' }>
                                        <li class="link">
                                            <a href="injectables/AccessTokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AccessTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CookieService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CookieService</a>
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
                                            'data-bs-target="#controllers-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' : 'data-bs-target="#xs-controllers-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' :
                                            'id="xs-controllers-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' }>
                                            <li class="link">
                                                <a href="controllers/MilestoneEstimateController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MilestoneEstimateController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' : 'data-bs-target="#xs-injectables-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' :
                                        'id="xs-injectables-links-module-MilestoneEstimateModule-311d97783303494f0a65b93135a33ca62d5d756ca3ebad5047741e9405f1794852b420fe6f15122ce7d9ff3da3f31144b007b634abc39b02f74e8712a3a2e44b"' }>
                                        <li class="link">
                                            <a href="injectables/DateService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DateService</a>
                                        </li>
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
                                            'data-bs-target="#controllers-links-module-ProfileModule-9854b5afd80e2d87316ecb9d96409ce713ec2a3a428c6e1d9f7fe359410bf01e6204fcc20f6de0064ec278418ddc72826affb3e634c2629622091b981ee2f26a"' : 'data-bs-target="#xs-controllers-links-module-ProfileModule-9854b5afd80e2d87316ecb9d96409ce713ec2a3a428c6e1d9f7fe359410bf01e6204fcc20f6de0064ec278418ddc72826affb3e634c2629622091b981ee2f26a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-9854b5afd80e2d87316ecb9d96409ce713ec2a3a428c6e1d9f7fe359410bf01e6204fcc20f6de0064ec278418ddc72826affb3e634c2629622091b981ee2f26a"' :
                                            'id="xs-controllers-links-module-ProfileModule-9854b5afd80e2d87316ecb9d96409ce713ec2a3a428c6e1d9f7fe359410bf01e6204fcc20f6de0064ec278418ddc72826affb3e634c2629622091b981ee2f26a"' }>
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
                                            'data-bs-target="#controllers-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' : 'data-bs-target="#xs-controllers-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' :
                                            'id="xs-controllers-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectMemberController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMemberController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' : 'data-bs-target="#xs-injectables-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' :
                                        'id="xs-injectables-links-module-ProjectMemberModule-aeb00f07364f89cd2ca9209dc3e839356a9948befcfbbe7a019027556e9b7cc61cb7010e28fa64fb16a773dfab8234e2dab6369c4026bbc4e3b496a841b5a02a"' }>
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
                                            'data-bs-target="#controllers-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' : 'data-bs-target="#xs-controllers-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' :
                                            'id="xs-controllers-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectMilestoneController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectMilestoneController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' : 'data-bs-target="#xs-injectables-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' :
                                        'id="xs-injectables-links-module-ProjectMilestoneModule-680a7bf5671277cd1bcf192bdee49d3126a7e1a4f319ae515f33ae216a045730f1a5068a2a416e42964810ca1c8c65019acb10a02201a7db203a3079a8cf9301"' }>
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
                                            'data-bs-target="#controllers-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' : 'data-bs-target="#xs-controllers-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' :
                                            'id="xs-controllers-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' : 'data-bs-target="#xs-injectables-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' :
                                        'id="xs-injectables-links-module-ProjectModule-3c0ab4cee7cc8dc540e05849be30717c1fc33065cfd30db9f64e28c812e3b81d3cdb667669f2db0f4dad2baab4d133fef7e507879bb28d04545c587f1e35772e"' }>
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
                                            'data-bs-target="#controllers-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' : 'data-bs-target="#xs-controllers-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' :
                                            'id="xs-controllers-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' }>
                                            <li class="link">
                                                <a href="controllers/ProjectReportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectReportController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' : 'data-bs-target="#xs-injectables-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' :
                                        'id="xs-injectables-links-module-ProjectReportModule-c2c5e2d4fc172529cf77991c14e396f6f30a0b5b2ef4a8446c5a2909ecb070f52a98adcd432399149b0b2cedbc399b4c05ea8fc0d6197ea5d0180c57b6bc8e63"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectReportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProjectReportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' : 'data-bs-target="#xs-controllers-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' :
                                            'id="xs-controllers-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' : 'data-bs-target="#xs-injectables-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' :
                                        'id="xs-injectables-links-module-UserModule-365dcd5a437bf8a5e0c0618a73495175941986065832130009405dc9bbe39557002b247b8a8aa82c008503b8e9331d2bcb245cfc591c7a25e22dac3f85c5397c"' }>
                                        <li class="link">
                                            <a href="injectables/CryptoService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CryptoService</a>
                                        </li>
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
                                <a href="classes/DeleteProjectNotAllowedException.html" data-type="entity-link" >DeleteProjectNotAllowedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/IncorrectCredentialsException.html" data-type="entity-link" >IncorrectCredentialsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvalidUUIDFormatException.html" data-type="entity-link" >InvalidUUIDFormatException</a>
                            </li>
                            <li class="link">
                                <a href="classes/NoAffectedRowException.html" data-type="entity-link" >NoAffectedRowException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectMemberAlreadyExistsException.html" data-type="entity-link" >ProjectMemberAlreadyExistsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjektarbeitAPI1723306279388.html" data-type="entity-link" >ProjektarbeitAPI1723306279388</a>
                            </li>
                            <li class="link">
                                <a href="classes/RelocatedMilestoneReachedFlag1723758746739.html" data-type="entity-link" >RelocatedMilestoneReachedFlag1723758746739</a>
                            </li>
                            <li class="link">
                                <a href="classes/StoredProcedureAndEvent1723306299388.html" data-type="entity-link" >StoredProcedureAndEvent1723306299388</a>
                            </li>
                            <li class="link">
                                <a href="classes/UnauthorizedException.html" data-type="entity-link" >UnauthorizedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAlreadyExistsException.html" data-type="entity-link" >UserAlreadyExistsException</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDoesNotExistException.html" data-type="entity-link" >UserDoesNotExistException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidUUIDPipe.html" data-type="entity-link" >ValidUUIDPipe</a>
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
                                    <a href="injectables/CookieService.html" data-type="entity-link" >CookieService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CryptoService.html" data-type="entity-link" >CryptoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateService.html" data-type="entity-link" >DateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JsonApiInterceptor.html" data-type="entity-link" >JsonApiInterceptor</a>
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