# GWD-ads-expendable
Google Web Designer **(GWD) Expandable Ads** with integrated cookie support.

```
<script src="adsExpendableGwd.js"></script>
```
## options
```
const adsOptions = {
        bannerDimention: { 
          width: 300, 
          heigth: 250 
        },
        expendDimention:{
            position:'fixed', // fixed, absolute
            width:'100%',  // px or %
            heigth:'100%',  // px or %
            extraSpaceOnAbsPos : 0,
        },
        oneTimeOpen:{
            useCookie:true,
            cookieName:'adsExpendableGwdSeen2',
            cookieExpireDays:1,
        },
        isAutoClose: {
            time:10, 
            show:true,
            position:'top-right', 
            backgroundColor:'#000',
            color:'#fff',
            margin:10
        },
        isExpandButton: {
            show:true,
            text:'Expend',
            position:'top-right', 
            backgroundColor:'#000',
            color:'#fff',
            margin:0
        },
        expandButtonId: 'expand-button',
        banner_page_id:'banner-page',
        expand_page_id:'expanded-page',
        eventType: 'click', // 'click', 'mouseover'
        YT:{
           closeExtraTime : 2 // in second
        }
       
    };
    new AdsExpendableGwd('gwd-ad', adsOptions);
```
## Banner Dimensions
```
bannerDimention: { 
  width: 300, 
  heigth: 250 
}
```
To set the banner size, define the `width` and `height` using numeric values. These values are automatically treated as pixels, so you do not need to include the `px` or `% symbols`.

## Expand View Dimensions

```
expendDimention:{
    position:'fixed', // fixed, absolute
    width:'100%',  // px or %
    heigth:'100%',  // px or %
    extraSpaceOnAbsPos : 0,
},
```
The position can be set to either `fixed` or `absolute`. If you are using an absolute position and need to add vertical spacing at the top when the ad expands, set the `extraSpaceOnAbsPos` value as an integer.

## One-Time Expansion

```
oneTimeOpen:{
    useCookie:true,
    cookieName:'adsExpendableGwdSeen2',
    cookieExpireDays:1,
},
```

To limit the ad to opening only once per day for each user, set ```useCookie: true```. You can adjust the frequency using the `cookieExpireDays` property.

## Auto-Close Expanded Ads

```
isAutoClose: {
    time:10, 
    show:true,
    position:'top-right',
    backgroundColor:'#000',
    color:'#fff',
    margin:10
},
```
To automatically hide the expanded ad after a specific duration, set the time value to a number greater than zero. If the value is set to zero, **auto-close** is disabled.
- To make the countdown timer visible, set `show: true`.
- If you want the ad to close automatically without showing a visible timer, set `show: false` while keeping the time value **greater than zero**.
- You can also customize the appearance using the `margin`, `backgroundColor`, `color`, and `position` properties.

### Available Positions 

The supported position values are: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`, `'bottom-center'`, and `'top-center'`.

## Custom Expand Button

```
isExpandButton: {
    show:true,
    text:'Expend',
    position:'top-right',
    backgroundColor:'#000',
    color:'#fff',
    margin:0
},
```
If you require a custom button for the **small banner** view, set `show: true` and customize the text and styles as needed.

## Event Type
```
eventType: 'click'
```

You can choose how the ad expands by changing the **event type**. The supported events are `'click'` and `'mouseover'`.

# Closing Expanded Ads on Video End
```
YT:{
   closeExtraTime : 2 // in second
}
```
By default, the **expanded ad** closes immediately when the **video ends**. You can use `closeExtraTime` to add a delay (in seconds) before the ad closes.

