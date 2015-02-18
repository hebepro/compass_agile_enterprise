// init from hs object
//////////////////////////////////////////
hs.graphicsDir = '/javascripts/highslide/graphics/';
hs.ieLt7 = hs.ie && hs.uaVersion < 7;
hs.ieLt9 = hs.ie && hs.uaVersion < 9;

hs.getPageSize();
hs.ie6SSL = hs.ieLt7 && location.protocol == 'https:';
for (var x in hs.langDefaults) {
    if (typeof hs[x] != 'undefined') hs.lang[x] = hs[x];
    else if (typeof hs.lang[x] == 'undefined' && typeof hs.langDefaults[x] != 'undefined')
        hs.lang[x] = hs.langDefaults[x];
}

// http://www.robertpenner.com/easing/
Math.linearTween = function (t, b, c, d) {
    return c * t / d + b;
};
Math.easeInQuad = function (t, b, c, d) {
    return c * (t /= d) * t + b;
};
Math.easeOutQuad = function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

hs.hideSelects = hs.ieLt7;
hs.hideIframes = ((window.opera && hs.uaVersion < 9) || navigator.vendor == 'KDE' || (hs.ieLt7 && hs.uaVersion < 5.5));