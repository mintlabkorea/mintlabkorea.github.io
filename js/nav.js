const topBarNav = document.querySelector('.top-bar-nav');
const logo = document.querySelector('.logo');
const topBarOption = document.querySelector('.top-bar-option');
const topBarSide = document.querySelector('.top-bar-side');
const gap = 180;
const navGapPx = getComputedStyle(document.getElementsByClassName('top-bar-nav')[0]).gap;
const navGap = Number(navGapPx.substring(0,navGapPx.length-2))
const deletedItem = [];
const deletedGap = [];
const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

topBarSideOn = false;

function gapDetected() {
    return window.innerWidth - logo.offsetWidth - topBarNav.offsetWidth > gap? false: true;
}

function resizeEvent() {
    while (topBarNav.firstElementChild && gapDetected()) {
        let item = topBarNav.firstElementChild;
        let itemText = item.querySelector('a') ? item.querySelector('a').innerText.trim() : "";

        // Remove "Members" but keep "Professor" & "Students" in mobile
        if (window.innerWidth <= 768 && itemText === 'Members') {
            let dropdownContent = item.querySelector('.dropdown-content'); // Get Professor & Students

            if (dropdownContent) {
                let subItems = dropdownContent.children;
                for (let i = 0; i < subItems.length; i++) {
                    let newItem = subItems[i].cloneNode(true);
                    newItem.style.textAlign = "center"; // Ensure text is centered
                    newItem.style.display = "block"; // Match other items
                    newItem.style.padding = "12px 0"; // Keep consistent spacing
                    topBarSide.appendChild(newItem);


                }
            }
            item.remove(); // Remove "Members"
            continue;
        }

        deletedItem.push(item);
        deletedGap.push(item.offsetWidth);
        topBarSide.appendChild(item);
    }

    while (deletedItem.length > 0 && 
           window.innerWidth - logo.offsetWidth - topBarNav.offsetWidth > navGap + gap + deletedGap[deletedGap.length - 1]) {
        topBarNav.appendChild(topBarSide.firstElementChild);
        deletedItem.pop();
        deletedGap.pop();
    }

    if (deletedItem.length) {
        topBarOption.style.display = 'flex';
    } else {
        topBarOption.style.display = 'none';
    }
}


window.addEventListener('resize',()=>{
    resizeEvent();
})

window.onload = function(){
    resizeEvent();
}

let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

setInterval(() => {
    resizeEvent();
}, 500);

const handleTopBarSide = (useClassName, unuseClassName) => {
    topBarSide.classList.add(useClassName);
    topBarSide.classList.remove(unuseClassName);
    if(useClassName==SHOWN_CLASSNAME) topBarSideOn=true;
    else topBarSideOn=false;
};

topBarSideFlag = false;
topBarSide.addEventListener('mouseenter',()=>{
    if(isMobile) return;
    topBarSideFlag=true;
})
topBarSide.addEventListener('mouseleave',()=>{
    if(isMobile) return;
    topBarSideFlag=false;
    handleTopBarSide(HIDDEN_CLASSNAME, SHOWN_CLASSNAME);
})

topBarOption.addEventListener('mouseenter',()=>{
    if(isMobile) return;
    handleTopBarSide(SHOWN_CLASSNAME, HIDDEN_CLASSNAME);
})
topBarOption.addEventListener('mouseleave',()=>{
    if(isMobile){
        return;
        handleTopBarSide(HIDDEN_CLASSNAME, SHOWN_CLASSNAME);
    }
    setTimeout(() => {
        if(!topBarSideFlag) handleTopBarSide(HIDDEN_CLASSNAME, SHOWN_CLASSNAME);
    }, 150);
})

topBarOption.addEventListener('click',()=>{
    if(!isMobile) return;
    if(topBarSideOn){
        handleTopBarSide(HIDDEN_CLASSNAME, SHOWN_CLASSNAME);
    }
    else{
        handleTopBarSide(SHOWN_CLASSNAME, HIDDEN_CLASSNAME);
    }
})
