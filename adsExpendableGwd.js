/**
 * gwd-ads-expendable.js
 *
 * @module gwd-ads-expendable
 * @version 1.0.0
 * @description GWD Ads Expendable with cookie support
 * @author Vishal Rathour
 */


function AdsExpendableGwd(id,options){
    if (AdsExpendableGwd.instance) {return AdsExpendableGwd.instance;}
    AdsExpendableGwd.instance = this;
    this.adsContainerID = id;
    this.iframe = window.frameElement || null;
    this.ads_page_container_id = 'pagedeck'; 
    this.ads_init_flag = false;
    this.bannerDimention = options.bannerDimention || {width:300,heigth:250};
    this.expendDimention = options.expendDimention || {
        position:'fixed', // fixed, absolute
        width:'100%',
        heigth:'100%',
        extraSpaceOnAbsPos:0,
    };
    this.oneTimeOpen = options.oneTimeOpen || {
        useCookie:false,
        cookieName:'adsExpendableGwdSeen', // default 
        cookieExpireDays:1, 
    };
    this.isAutoClose = options.isAutoClose ||  {
        time:0, 
        show:false,
        position:'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-center',  'top-center'
        backgroundColor:'#000',
        color:'#fff',
        margin:0
    };
    this.expandButtonId = options.expandButtonId || null;
    this.eventType = options.eventType || 'click';
    this.isExpandButton = options.isExpandButton || {
        show:false,
        text:'Expend',
        position:'top-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'bottom-center',  'top-center'
        backgroundColor:'#000',
        color:'#fff',
        margin:0
    };
    this.banner_page_id = options.banner_page_id || 'banner-page';
    this.expand_page_id = options.expand_page_id || 'expanded-page';
    this._eventsBound = false;
    this.userInteracted = false;
    this.YT = options.YT || {
        closeExtraTime : 0 // in second
    }

   
};

AdsExpendableGwd.prototype.getCookie = function(cookieName) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
};

AdsExpendableGwd.prototype.setCookieDays = function(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
};



AdsExpendableGwd.prototype.pageIsExpendable = function(){
   return !this.getCookie(this.oneTimeOpen.cookieName);
};



AdsExpendableGwd.prototype.iframeView = function(page_view = "large"){
    if(this.iframe){
        const position = this.expendDimention.position;
        if(position !== "fixed"){
            if(page_view.toUpperCase() === "SMALL"){
                const parentDiv = this.iframe.parentElement;
                parentDiv.style.cssText = `
                position:relative;
                width: ${this.bannerDimention.width}px; 
                height: ${this.bannerDimention.heigth}px;
                `;

                Object.assign(this.iframe.style, {
                    width: this.bannerDimention.width+ 'px',
                    height: this.bannerDimention.heigth + 'px',
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                });
            }
            if(page_view.toUpperCase() === "LARGE"){
                const parentDiv = this.iframe.parentElement;
                const parentScrollY = window.parent.scrollY || window.parent.pageYOffset;
                parentDiv.style.cssText = `
                position:absolute;
                width: ${this.expendDimention.width}; 
                height: ${this.expendDimention.heigth};
                z-index: 2147483647;left:50%;top:${(parentScrollY || 0) + (this.expendDimention.extraSpaceOnAbsPos || 0)}px;transform:translateX(-50%);
                `;

                 Object.assign(this.iframe.style, {
                    width: this.expendDimention.width,
                    height: this.expendDimention.heigth, 
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                });
            }
        }
        else{
            if(page_view.toUpperCase() === "LARGE"){
                Object.assign(this.iframe.style, {
                    width: this.expendDimention.width,
                    height: this.expendDimention.heigth,
                    position: 'fixed',
                    top: '0px',
                    left: '0px',
                    zIndex : '2147483647',
                });
               
            }
            if(page_view.toUpperCase() === "SMALL"){
                Object.assign(this.iframe.style, {
                    width: this.bannerDimention.width + 'px',
                    height: this.bannerDimention.heigth + 'px',
                    position:'relative',
                    top: 'unset',
                    left: 'unset',
                    zIndex:'0'
                });
               
            }
        }

        
    }
}

AdsExpendableGwd.prototype.events = function () {
    if (!window.Enabler || !window.studio) return;
   
    const bindEvents = () => {  };
    Enabler.isInitialized() ? bindEvents() : Enabler.addEventListener(Enabler.EventType.INIT, bindEvents);

    const page_def = document.getElementById(this.ads_page_container_id);
    if(!page_def) return;

    if(this.iframe) {
        this.iframe.style.transition = 'opacity 1s ease-in-out';
    }

    page_def.addEventListener('pagetransitionstart', (e) => {
        if(this.iframe) {this.iframe.style.opacity = "0";}
       
    });
    page_def.addEventListener('pagetransitionend', (e) => {
       if (this.iframe) this.iframe.style.visibility = "visible";

       if(e.detail?.incomingPage?.id === this.expand_page_id){this.iframeView("LARGE")}
       else{this.iframeView("SMALL");}

       window.requestAnimationFrame(() => {
           if (this.iframe) {
                    this.iframe.style.visibility = "visible";
                    this.iframe.style.opacity = "1"; // Smooth dissolve in
            }
        });
      
    });

};

AdsExpendableGwd.prototype.getButtonPosition = function(position='top-right', margin=0){
    let positions = undefined;

     switch(position){
        case 'top-left':{
            positions = `left: ${margin}px;top: ${margin}px;`;
            break;
        }
        case 'top-right':{
            positions = `right: ${margin}px;top: ${margin}px;`;
            break;
        }
        case 'bottom-left':{
            positions = `left: ${margin}px;bottom: ${margin}px;`;
            break;
        }
        case 'bottom-right':{
            positions = `right: ${margin}px;bottom: ${margin}px;`;
            break;
        }
        case 'bottom-center':{
            positions = `left: 50%;bottom: ${margin}px;transform:translateX(-50%);`;
            break;
        }
        case 'top-center':{
            positions = `left: 50%;top: ${margin}px;transform:translateX(-50%);`;
            break;
        }
        default:{
            positions = `right: ${margin}px;top: ${margin}px;`;
            break;
        }
     }

     return positions;

};

AdsExpendableGwd.prototype.getExpandButton = function(){
    let button = document.createElement('div');
    button.setAttribute('role', 'button');
    button.innerText = this.isExpandButton?.text || 'Expand';

    const _pos = this.getButtonPosition(this.isExpandButton?.position || 'top-right', this.isExpandButton?.margin || 0);
    const style = `background-color:${this.isExpandButton?.backgroundColor}; color:${this.isExpandButton?.color};${_pos}
    position: absolute; padding: 5px; font-size: 16px; border-radius: 4px;  font-family: sans-serif; cursor: pointer; z-index: 20;`;

    button.style.cssText = style;

    button.addEventListener(this.eventType, (e)=>{
        e.stopPropagation()
        console.log(`Event ${this.eventType} fired.`);
        if(gwd){
            gwd.actions.gwdGoogleAd.goToPage("gwd-ad",this.expand_page_id);
            const page_def = document.getElementById(this.ads_page_container_id);
            if(page_def) {page_def.removeAttribute('is-first-intraction-view');}
            
        }  
    });
   
    return button;
};


AdsExpendableGwd.prototype.autoCloseDiv = function(divId, timeInSeconds = 10, countDownShow = true, onClose){
    const div = document.getElementById(divId);
    if (!div) return;

    if(!countDownShow){div.style.opacity = "0";}

    const countdownEl = div.querySelector('#gwd_count_down');
    let timeLeft = timeInSeconds;

    if (countdownEl) countdownEl.textContent = timeLeft;

    const interval = setInterval(() => {
        timeLeft--;

        if (countdownEl) {
            countdownEl.textContent = timeLeft;
        }

        if (timeLeft <= 0) {
            clearInterval(interval);
            div.style.display = 'none';

            if (typeof onClose === 'function') {
                onClose();
            }
        }
    }, 1000);
}

AdsExpendableGwd.prototype.getCloseElement = function(){
    let div = document.createElement('div');
    div.setAttribute('role', 'timer');
    div.innerHTML = 'Close in <span id="gwd_count_down">10</span>s';
    div.setAttribute('id','gwd_timer_close');

    const _pos = this.getButtonPosition(this.isAutoClose?.position || 'top-right', this.isAutoClose?.margin || 0);
    console.log(_pos)
    const style = `background-color:${this.isAutoClose?.backgroundColor}; color:${this.isAutoClose?.color};${_pos}
    position: absolute; padding: 5px; border-radius: 4px;font-size: 16px; font-family: sans-serif; cursor: pointer; z-index: 20;`;

    div.style.cssText = style;
    return div;
};


AdsExpendableGwd.checkYT = function(element){
    if(!element) return;
    const hasPausedProp = element.getAttribute('pause-on-end');
    const hasLoopProp = element.getAttribute('loop');

    hasPausedProp && (element.removeAttribute('pause-on-end'));
    hasLoopProp && (element.removeAttribute('loop'));

    element.addEventListener('ended', () => {
        setTimeout(()=>{
            if(gwd){gwd.actions.gwdGoogleAd.goToPage("gwd-ad", this.instance.banner_page_id);}
        }, (Number(this.instance.YT?.closeExtraTime * 1000) || 0));
       
    });

    if(hasPausedProp){
        element.addEventListener('click', () => {
            this.instance.userInteracted = !this.instance.userInteracted;
        });
    
        element.addEventListener('paused', ()=>{
            if(!this.instance.userInteracted){
                setTimeout(()=>{
                    if(gwd){gwd.actions.gwdGoogleAd.goToPage("gwd-ad", this.instance.banner_page_id);}
                }, (Number(this.instance.YT?.closeExtraTime * 1000) || 0));
           
            }
            console.log('video is paused by user', this.instance.userInteracted)
        });
    }

};

AdsExpendableGwd.addCustomEvent = function(){
    if (this._customEventAdded) return;   
    this._customEventAdded = true;

    if(!this.instance.expandButtonId) return;

    const expandButtonEl = document.getElementById(this.instance.expandButtonId);
    if (!expandButtonEl) return;

    if (!window.Enabler || !window.studio) return;

    expandButtonEl.addEventListener(this.instance.eventType, ()=>{
        console.log(`expend ${this.instance.eventType} event fired.`);
        if(gwd){gwd.actions.gwdGoogleAd.goToPage("gwd-ad",this.expand_page_id);}
    },{once: true});

};

AdsExpendableGwd.drawExpandButton = function(element){
    if(!element) return;
    if(this.instance.isExpandButton?.show){
        const exButton = this.instance.getExpandButton();
        exButton && element.appendChild(exButton);
    }
};

AdsExpendableGwd.drowTimer = function(element){
    if(!element) return;

    if(this.instance.isAutoClose.time > 0){
        const page_def = document.getElementById(this.instance.ads_page_container_id);
        if(page_def){
           const hasIntraction =  page_def.getAttribute('is-first-intraction-view');
           if(hasIntraction){
                const timerElement = this.instance.getCloseElement();
                timerElement && element.appendChild(timerElement); // append child for timer

                this.instance.autoCloseDiv('gwd_timer_close', this.instance.isAutoClose.time, this.instance.isAutoClose.show,  () => {
                    console.log('large ads close on timer end:- ', this.instance.isAutoClose.time);
                    if(gwd){gwd.actions.gwdGoogleAd.goToPage("gwd-ad", this.instance.banner_page_id);}
                });
           }
        }
    }
};

// global render after web components ready

AdsExpendableGwd.defaultRender = function(){
    // WebComponentsReady
    if(!this.instance || this.instance.ads_init_flag) return;
    if(this.instance.iframe){
        this.instance.iframe.setAttribute('scrolling', 'no');
        this.instance.iframe.setAttribute('frameborder', '0');                       
    }    

    const page_def = document.getElementById(this.instance.ads_page_container_id);
    if(!page_def) return;

      
    if(this.instance.oneTimeOpen.useCookie){
        if(!this.instance.pageIsExpendable()){
            page_def.setAttribute('default-page','banner-page');
        }
        else{
            page_def.setAttribute('default-page','expanded-page');
            page_def.setAttribute('is-first-intraction-view', true);
            this.instance.setCookieDays(this.instance.oneTimeOpen.cookieName,"1",this.instance.oneTimeOpen.cookieExpireDays);
           
        }
    }
    else{
        
        page_def.setAttribute('is-first-intraction-view', true);
     
       
    }
        
        
        

    
};

AdsExpendableGwd.init = function(){
    // Ad initialized
    if(!this.instance.ads_init_flag){
        this.instance.ads_init_flag = true;  // only one time init
        this.instance.events(); // add gwd default event
    }
};




AdsExpendableGwd.meta = {
  file: "gwd-ads-expendable.js",
  version: "1.0.0",
  description: "GWD Ads Expendable with cookie support",
  author: "Vishal Rathour"
};


window.addEventListener('adinitialized',function(event) {
    console.log('adinitialized');
    AdsExpendableGwd.init(event); // run after default render
    
}, false);

window.addEventListener('WebComponentsReady',function(event) {
    
}, false);

window.addEventListener('DOMContentLoaded',function(event){
    console.log('DOMContentLoaded');
    AdsExpendableGwd.defaultRender(event); // run first
}, false);


document.addEventListener('ready', function (e) {
    AdsExpendableGwd.addCustomEvent();  // mapping custom event on doc ready
    if (e.target.tagName === 'GWD-YOUTUBE') {
        AdsExpendableGwd.checkYT(e.target); // fired YT event
    }

    if(e.target.id === AdsExpendableGwd.instance.banner_page_id){
        AdsExpendableGwd.drawExpandButton(e.target);  // drow expend button
    }

    if(e.target.id === AdsExpendableGwd.instance.expand_page_id){
        AdsExpendableGwd.drowTimer(e.target); // drow timer
       
    }

    
}, true);




