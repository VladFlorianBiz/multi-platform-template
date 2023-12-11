/*************************************************************************************************
** Imports                                                                                      **
**************************************************************************************************/
//-- **Core** -----------------------------------------------------------------------------------//
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { ElementRef, Renderer2, AfterViewInit } from '@angular/core';

//-- **Data Models** ----------------------------------------------------------------------------//
//-- **Helpers/Services** -----------------------------------------------------------------------//

@Component({
    selector: 'cstm-pricing',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
})

/**
 * @export
 * @component PricingComponent
 * @example <ion-content>
      <cstm-pricing  (onClick)=someMethodOnPageUsingComponent($event)
                      [name]="someVariableOnPageUsingComponent1" 
                      [description]="someVariableOnPageUsingComponent2"
                      [value]="someVariableOnPage"
                      [downloadUrl]="someVariableOnPage" 
                      [pricing]="pricingVariableOnPageUsingComponent">
      </cstm-pricing> 
   </ion-content>
 */
export class PricingComponent implements AfterViewInit  {

    isYearlyPriceStructure = false;
    isTestMode = true;

    plans = [
        {
            id: 1,
            friendlyName: 'Welcome',
            price: 0,
            annualPrice: 0,
            //------------------------------>
            stripeProductId: null,
            stripePriceId: null,
            stripeBuyLink: null,
            stripeProductName: null,
            //------------------------------>
            monthlyStripeProductId: null,
            monthlyStripePriceId: null,
            monthlyStripeBuyLink: null,
            monthlyProductName: null,
            //------------------------------>
            yearlyStripeProductId: null,
            yearlyStripePriceId: null,
            yearlyStripeBuyLink: null,
            yearlyProductName: null,
            //------------------------------>
            testStripeProductId: null,
            testStripePriceId: null,
            testStripeBuyLink: null,
            testProductName: null,
            //------------------------------>
            features: [
                'lorem consectetur in',
                'tempor lorem sed dolore'
            ],
            link: '#basic',
            cta: 'Selected',
            yearlySelected: false,
            selected: true,
        },
        {
            id: 2,
            friendlyName: 'Basic',
            price: 24.99,
            annualPrice: 269,
            //------------------------------>
            stripeProductId: null,
            stripePriceId: null,
            stripeBuyLink: null,
            stripeProductName: null,
            //------------------------------>
            monthlyStripeProductId: 'prod_OvDCUDFu3DaVNq',
            monthlyStripePriceId: 'price_1O7Mm3LPEa1WRRoxj99qu2sN',
            monthlyStripeBuyLink: 'https://buy.stripe.com/14k3fe2iC3Ze90c4gg',
            monthlyProductName: 'Basic',
            //------------------------------>
            yearlyStripeProductId: 'prod_OvDUXeJMkGmW2l',
            yearlyStripePriceId: 'price_1O7N3jLPEa1WRRoxSvIxKRit',
            yearlyStripeBuyLink: 'https://buy.stripe.com/4gw8zy3mGdzOekweUX',
            yearlyProductName: 'Basic - Yearly',
            //------------------------------>
            testStripeProductId: 'prod_OyCjCPJmGGiG09',
            testStripePriceId: 'price_1OAGJeLPEa1WRRoxKi4tjvQc',
            testStripeBuyLink: 'https://buy.stripe.com/14k3fe2iC3Ze90c4gg',
            testProductName: 'Basic - Test',
            //------------------------------>
            features: [
                'ut adipiscing tempor ',
                'sed magna elit lorem do et sed dolore adipiscing adipiscing dolore adipis',
                'sed sit ipsum dolor consectetur labore '
                
            ],
            link: '#basic',
            cta: 'Get Started',
            yearlySelected: false,
            selected: false,
        },
        {
            id: 3,
            friendlyName: 'Pro',
            price: 49.99,
            annualPrice: 539,
            //------------------------------>
            stripeProductId: null,
            stripePriceId: null,
            stripeBuyLink: null,
            stripeProductName: null,
            //------------------------------>
            monthlyStripeProductId: 'prod_OvDLQLyRQKSKtF',
            monthlyStripePriceId: 'price_1O7MugLPEa1WRRoxZ2qcJeFn',
            monthlyStripeBuyLink: 'https://buy.stripe.com/5kA4ji7CW1R6dgsdQR',
            monthlyProductName: 'Pro',
            //------------------------------>
            yearlyStripeProductId: 'prod_OvDXJKsJvTZitc',
            yearlyStripePriceId: 'price_1O7N6CLPEa1WRRoxoUnQQ7Yn',
            yearlyStripeBuyLink: 'https://buy.stripe.com/9AQg203mG53i0tG9AE',
            yearlyProductName: 'Pro - Yearly',
            //------------------------------>
            testStripeProductId: 'prod_OyCkh7NbsWJK5F',
            testStripePriceId: 'price_1OAGLILPEa1WRRoxhEqToTF2',
            testStripeBuyLink: 'https://buy.stripe.com/test_00gdS91Ez3GgdAA289',
            testProductName: 'Pro - Test',
            //------------------------------>
            features: [
                'sit dolor dolore aliqu',
                'dolor sit labore et tempor labore adipiscing sit aliqua magna dolor ut do',
                'magna elit sed incididunt consectetur eiu',
                'do dolor do incididunt dolore dolore amet ipsum et adipiscing d'
            ],
            link: '#pro',
            cta: 'Upgrade to Pro',
            yearlySelected: false,
            selected: false,

        },
        {
            id: 4,
            friendlyName: 'Ultimate',
            price: 199.99,
            annualPrice: 2160,
            //------------------------------>
            stripeProductId: null,
            stripePriceId: null,
            stripeBuyLink: null,
            stripeProductName: null,
            //------------------------------>
            monthlyStripeProductId: 'prod_OvDQwmgsZLmcIh',
            monthlyStripePriceId: 'price_1O7MzXLPEa1WRRoxSdUvxDf8',
            monthlyStripeBuyLink: 'https://buy.stripe.com/5kAdTS1eygM090c7su',
            monthlyProductName: 'Ultimate',
            //------------------------------>
            yearlyStripeProductId: 'prod_OvDZoPdIApzeiP',
            yearlyStripePriceId: 'price_1O7N86LPEa1WRRoxlS4TPbzp',
            yearlyStripeBuyLink: 'https://buy.stripe.com/bIY8zyg9sfHW0tG9AF',
            yearlyProductName: 'Ultimate - Yearly',
            //------------------------------>
            testStripeProductId: 'prod_OyCm72GC4MBmap',
            testStripePriceId: 'price_1OAGMmLPEa1WRRoxxsaHxR4w',
            testStripeBuyLink: 'https://buy.stripe.com/test_5kA01j1Ez0u4688146',
            testProductName: 'Ultimate - Test',
            //------------------------------>
            features: [
                'sit sit lorem sit labor',
                'aliqua incididunt dolor sit dolor dolore incididunt amet dolore incididun',
                'amet adipiscing lorem amet sed incididunt incididunt do',
                'amet lorem consectetur tempor aliqua dolore ut',
            ],
            link: '#ultimate',
            cta: 'Go Ultimate',
            yearlySelected: false,
            selected: false,
        }
    ];

    

    private cardsContainer: HTMLElement;
    private overlay: HTMLElement;



    //---------------------------------------------------------->
    //-- Inputs ------------------------------------------------>
    @Input() name: string = '';
    @Input() description: string = '';
    @Input() value?: any = {};
    @Input() downloadUrl?: string = '';

    //------------------------------------------>
    //-- Outputs ------------------------------->
    @Output() onClick = new EventEmitter<any>();



    /************************************************************************************
    * @constructor Component Constructor
    * @description  Initialize Class and Dependencies(Imports), see SOME examples below.
    *							- Helpers: UiHelper, PricingDataObjHelper, FirebaseHelper
    *							- Services: PricingService
    *							- Ionic: NavController, ModalController
    *							- Form: FormBuilder
    *							- State: Store<AppState>
    * @return void
    **************************************************************************************/
    constructor(
        private elRef: ElementRef, 
        private renderer: Renderer2
        ) { }


    /**
* @method ngOnInit
* @description Angular page life cycle method that runs after class and its dependencies have been initialized.
*							Imports are available to be used at this point
*							- can be used to initialize form
*							- Can be used to subscribe to pricing selectors(pricing state variables/observable streams) 
*							- Make sure you destroy any subscribed to streams on page destroy or else memory leaks can occur
* @return void
*/
    ngOnInit(): void {

    }



    toggleOption(isYearlyPriceStructureToggleFlag: boolean) {
        this.isYearlyPriceStructure = isYearlyPriceStructureToggleFlag
    }
    
    /**
    * @method onClickEvent
    * @example <ion-content>
                 <cstm-pricing (onClick)=someMethodOnPageUsingComponent($event)>
                 </cstm-pricing>
              </ion-content>
    * @description When PricingComponent emits a click event it will
    *							   - emits the value found inside this component(this.value) to any page/component using it
    * @return any
    */


    onPlanSelected(_plan) {


        if (this.isTestMode) {
            const stripeBuyLink = _plan.testStripeBuyLink;
            const stripeProductId = _plan.testStripeProductId;
            const stripePriceId = _plan.testStripePriceId;
            const stripeProductName = _plan?.testProductName
            const plan = {
                stripeProductName,
                stripeBuyLink,
                stripeProductId,
                stripePriceId,
            }
            this.onClick.emit(plan);
        } else {
            const stripeBuyLink = (this.isYearlyPriceStructure) ? _plan.yearlyStripeBuyLink : _plan.monthlyStripeBuyLink;
            const stripeProductId = (this.isYearlyPriceStructure) ? _plan.yearlyStripeProductId : _plan.monthlyStripeProductId;
            const stripePriceId = (this.isYearlyPriceStructure) ? _plan.yearlyStripePriceId : _plan.monthlyStripePriceId;
            const stripeProductName = (this.isYearlyPriceStructure) ? _plan.yearlyProductName : _plan?.monthlyProductName
            const plan = {
                stripeProductName,
                stripeBuyLink,
                stripeProductId,
                stripePriceId,
            }
            this.onClick.emit(plan);
        }

    }





    ngAfterViewInit() {
        this.cardsContainer = this.elRef.nativeElement.querySelector('.cards');
        this.overlay = this.elRef.nativeElement.querySelector('.overlay');

        const cards: HTMLElement[] = Array.from(this.elRef.nativeElement.querySelectorAll('.card'));
        cards.forEach(card => this.initOverlayCard(card));

        // Listen on the cardsContainer instead of body
        this.renderer.listen(this.cardsContainer, 'pointermove', (e) => this.applyOverlayMask(e));
    }

    private applyOverlayMask(e: PointerEvent) {
        // Get the position of the cursor relative to the .cards container
        const x = e.pageX - this.cardsContainer.getBoundingClientRect().left;
        const y = e.pageY - this.cardsContainer.getBoundingClientRect().top;

        // Adjust the --x and --y properties to position the overlay circle
        document.body.style.setProperty('--opacity', '1');
        document.body.style.setProperty('--x', `${x}px`);
        document.body.style.setProperty('--y', `${y}px`);
    }


    private initOverlayCard(cardEl: HTMLElement) {
        const overlayCard = this.renderer.createElement('div');
        this.renderer.addClass(overlayCard, 'card');

        const originalCta = cardEl.querySelector('.card__cta') as HTMLElement;
        if (originalCta) {
            const overlayCta = this.renderer.createElement('div');
            this.renderer.addClass(overlayCta, 'cta');
            this.renderer.appendChild(overlayCard, overlayCta);
            this.renderer.listen(overlayCta, 'click', () => originalCta.click());
        }

        this.renderer.appendChild(this.overlay, overlayCard);

    }

}
