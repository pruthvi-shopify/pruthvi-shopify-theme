$(document).ready(function(){ 
  
   $('.mobile-nav-btn').click(function(){
   $(this).toggleClass('openmobNav');
   $('.mob-nav').slideToggle(500);
   });

   $('.nav-list-item > a').click(function(){
   $(this).parent('.nav-list-item').toggleClass('showNav');
   $(this).parent().find('.sub-nav').slideToggle();
   });

   $('.hero-slider').slick({
   arrows:false,
   dots:true,
   infinite:true,
   slidesToShow: 1,
   autoplay: true
   });

   $('.niceSelect').niceSelect();


   $('.top-slider').slick({
   
   slidesToShow: 1,
   slidesToScroll: 2,
   arrows: false,
   fade: true,
   asNavFor: '.bottom-slider'
   });
   $('.bottom-slider').slick({
   slidesToShow: 4,
   slidesToScroll: 1,
   asNavFor: '.top-slider',
   dots: false,
   arrows: false,
   focusOnSelect: true,
   responsive: [
    {
      breakpoint: 641,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    }
    ]
   });


   $('.specification h6').click(function(){
   if($(this).hasClass('openSpec')){
    $('.specification h6').removeClass('openSpec');
    $('.spec-info').slideUp();
   }else{
    $('.specification h6').removeClass('openSpec');
    $('.spec-info').slideUp();
    $(this).toggleClass('openSpec');
    $(this).next().slideToggle();
   }
   })

   $('.product-slider').slick({
   arrows:false,
   dots:false,
   infinite:false,
   slidesToShow: 4,
   responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 401,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
   ]    
   });


   $('.customerLove-slider').slick({
   arrows:false,
   dots:true,
   infinite:true,
   slidesToShow: 3,
   responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    },
    {
      breakpoint: 541,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]    
   });

   $('.filterBtn').click(function(){
  $('.filter-inner').slideToggle();
   });
});  
  //  $('.cart-drawer-btn').click(function(e){
  //   e.preventDefault();
  //     $(this).toggleClass('openCart');
  //       $('.cart-drawer').addClass('showCart');
  //       });

  //       $('.close-btn, .cart-drawer .bgoverlay').click(function(e){
  //         e.preventDefault();
  //         $('.cart-drawer').removeClass('showCart');
  //         });

$(document).on('click', '.cart-drawer-btn', function(e) {
    e.preventDefault();
    $(this).toggleClass('openCart');
    $('.cart-drawer').addClass('showCart');
});

$(document).on('click', '.close-btn, .cart-drawer .bgoverlay', function(e) {
    e.preventDefault();
    $('.cart-drawer').removeClass('showCart');
});


// colloection page filter code ==============================================
   document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('#productGrid');
    // console.log(productGrid);
    const filterSidebar = document.querySelector('#filterSidebar');
    // console.log(filterSidebar);

    //  Get current URL params
    function getCurrentParams() {
      return new URLSearchParams(window.location.search);
    }

    //  Fetch collection & update DOM
    function fetchCollection(params) {
      const url = window.location.pathname + '?' + params.toString();
      // console.log(url);
      fetch(url)
        .then((res) => res.text())
        .then((html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          productGrid.innerHTML = doc.querySelector('#productGrid').innerHTML;
          filterSidebar.innerHTML = doc.querySelector('#filterSidebar').innerHTML;
          history.pushState({}, '', url);
          attachClickEvents(); 
        });
     }

     //  Build params (includes filters + price + sort)
     function buildParams() {
         const params = getCurrentParams();
         // console.log(params);

         // Keep price filter values
         const priceForm = document.getElementById('priceFilterForm');
         if (priceForm) {
         const minInput = priceForm.querySelector('#minPrice');
         // console.log(minInput);
         const maxInput = priceForm.querySelector('#maxPrice');
        //  console.log(maxInput);
         const minName = priceForm.querySelector('#minPriceCents')?.name;
         const maxName = priceForm.querySelector('#maxPriceCents')?.name;


         if (minInput?.value) params.set(minName, parseInt(minInput.value * 100 ));
         if (maxInput?.value) params.set(maxName, parseInt(maxInput.value * 100 ));
      }

      return params;
    }

    //  Attach all event handlers
    function attachClickEvents() {
      // FILTER LINKS
      filterSidebar.querySelectorAll('a').forEach((link) => {
        link.onclick = (e) => {
          e.preventDefault();

          // Clear all 
          if (link.id === 'clearAllBtn') {
            const url = link.href;
            // console.log(url);
            fetch(url)
              .then((res) => res.text())
              .then((html) => {

                const doc = new DOMParser().parseFromString(html, 'text/html');
                // console.log(doc);
                const newSidebar = doc.querySelector('#productGrid');
                // console.log(newSidebar);
                if(newSidebar){
                  productGrid.innerHTML = newSidebar.innerHTML;
                  attachClickEvents();
                }
              });
            fetchCollection(new URLSearchParams());
             return;         
          }

          const currentParams = getCurrentParams();
          // console.log(currentParams);
          const linkParams = new URL(link.href).searchParams;
          // console.log(linkParams);

          // close-btn functionality !!
           if (link.href.includes('filter.') && link.href.includes('=') && link.closest('.accessories')) {
        fetchCollection(linkParams);
      }
          // Merge all link params (keep old + new)
          linkParams.forEach((value, key) => {
            const existingValues = currentParams.getAll(key);
            // Add only if not already present
            if (!existingValues.includes(value)) {
              currentParams.append(key, value);
            }
          });

          fetchCollection(currentParams);
        };
      });

      // PRICE FILTER
      const priceForm = document.getElementById('priceFilterForm');
      // console.log(priceForm);
      if (priceForm) {
        priceForm.onsubmit = (e) => {
          e.preventDefault();
          fetchCollection(buildParams());
        };
      }

      // SORT BY DROPDOWN
      const sortBy = document.getElementById('sortBySelect');
      // console.log(sortBy);
      if (sortBy) {
        sortBy.onchange = (e) => {
          const params = buildParams();
          // console.log(params);
          params.set('sort_by', e.target.value);
          fetchCollection(params);
        };
      }

      const currentParams = getCurrentParams();
      const selectedSort = currentParams.get('sort_by');
      const sortSelect = document.getElementById('sortBySelect');
      if(sortSelect && selectedSort) {
        sortSelect.value = selectedSort;
      }
    }
    attachClickEvents();
   });




   /// collection filter product tag : 
  
// document.addEventListener('DOMContentLoaded', function() {
//     const filterLists = document.querySelectorAll('.ajax-filter-list');
//     console.log(filterLists);
//     const productGrid = document.getElementById('productGrid');
//     console.log(productGrid);

//     filterLists.forEach(list => {
//       list.addEventListener('click', function(event){
//         const target = event.target.closest('a');
//         console.log(target);
 
//         if(target && target.dataset.tag){
//           event.preventDefault();

//           const tag = target.dataset.tag;
//           const url = `/collections/all?filter.p.tag=${encodeURIComponent(tag)}`;

//           fetch(url)
//             .then(response => response.text())
//             .then(html => {
//               const parser = new DOMParser();
//               const doc = parser.parseFromString(html, 'text/html');
//               const newProductGrid = doc.getElementById('productGrid');

//               if(newProductGrid) {
//                 productGrid.innerHTML = newProductGrid.innerHTML;
//               }
//             })
//             .catch(error => console.error('Error fetch:', error));
//         }
//       });
//     });

//   });


// //  second tag js code : 
//   document.addEventListener('DOMContentLoaded', function () {

//   document.addEventListener('change', function (e) {
//     if (e.target.classList.contains('tag-filter-checkbox')) {
//       const url = e.target.getAttribute('data-url');
//       console.log(url);
//       if (url) {
//         updatetag(url);
//       }
//     }
//   });
//   function updatetag(url) {
//     const newurl = `${url}${url.includes('?') ? '&' : '?'}section_id=main-collection`;
//     console.log(newurl);
//     fetch(newurl)
//       .then(res => res.text())
//       .then(responseText => {
//         console.log(responseText);
//         const html = new DOMParser().parseFromString(responseText, 'text/html');  
//         console.log(html);
//         const newGrid = html.querySelector('#productGrid').innerHTML;
//         console.log(newGrid);
//         document.querySelector('#productGrid').innerHTML = newGrid;
//         const newSidebar = html.querySelector('#filterSidebar').innerHTML;
//         document.querySelector('#filterSidebar').innerHTML = newSidebar;

//         history.pushState({ url }, '', url);
        
//           // initProductScripts(document.querySelector('#productGrid'));
//         //  initProductScripts(); 
//         //  initializeQuickView(); 
//       })
//       .catch(err => {
//         console.error("Error:", err);
//       });
//   }
// });



   //predictive search in search page =======================================
   class PredictiveSearch extends HTMLElement {

      connectedCallback() { 
      this.input = this.querySelector('input[type="search"]');
      // console.log(this.input);
      this.resultbox = this.querySelector('#predictive-search');
      // console.log(this.resultbox);

      if (this.input) {
      this.input.addEventListener('input', this.debounce((event) => {
        this.onChange(event);
        }, 500));

       this.input.addEventListener('click', (event) => {
        event.stopPropagation();
        if(this.input.value.length === 0){
          this.renderRecentViews();
        }
       });
      }

      this.resultbox.addEventListener('click', (event) => {
        if(event.target.classList.contains('clear-recent-btn')){
          this.clearRecent();
        }
      })

      document.addEventListener('click', (event) => {
      if (!this.contains(event.target))
          this.close();
    });
    }

    clearRecent(){
      localStorage.removeItem('recently_viewed');
      this.renderRecentViews();
    }

  renderRecentViews() {
    const recentData = JSON.parse(localStorage.getItem('recently_viewed')) || [];
    // console.log(recentData);

    if (recentData.length > 0){
      let html = 
      `<div class="recent-views" style="padding: 15px; background:white; border-radius: 8px; box-show: 0 4px 12px rgba(0,0,0,0.15); text-align: center;">
      <button class="clear-recent-btn" style="padding:5px 15px;">CLEAR RECENT PRODUCT</button>
      <h4 style="border-bottom:1px solid #eee; margin: 0 0 10px 0; font-size: 16px; padding-bottom: 5px; color: #333;">
      Recent Views</h4>
      <ul style="list-style:none; padding: 0; margin: 0; display:flex"">
      `;
      recentData.forEach(product => {
        html += `
          <li style="border-radius: 4px; margin-bottom: 10px; transition: background 0.3s;>
            <a href="${product.url}" style="display:flex; align-items:center; margin-bottom:10px; text-decoration:none; color:black; gap: 10px; padding: 5px;">
              <img src="${product.image}" width="50" height="50 style="margin-right:10px; border-radius: 4px;"> <br>
              <span style="font-size: 14px; font-weight: 500;">${product.title}</span>
            </a>
          </li>`;
      });
      html += '</ul></div>';
      this.resultbox.innerHTML = html;
      this.open();
    } else {
      this.resultbox.innerHTML = '<p style="padding:20px; text-align: center;">No recent views yet.</p>';
       this.open();
    }
  }
      
    onChange() {
      const searchvalue = this.input.value.trim();
      if(!searchvalue.length){
        this.renderRecentViews();
      }
      this.getSearchResults(searchvalue);
     }

      getSearchResults(searchvalue) {
    fetch(`/search/suggest?q=${searchvalue}&section_id=predictive-search`)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const resultsMarkup = doc.querySelector('#shopify-section-predictive-search');
        if (resultsMarkup) {
          this.resultbox.innerHTML = resultsMarkup.innerHTML;
          this.open();
        }
      });
    }
      open() {
      this.resultbox.style.display = 'block';
      }
      close() {
       this.resultbox.style.display = 'none';
      }

     debounce(fn, wait) {
      let t;
      return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args),
       wait);
       };
      }
     }
     customElements.define('p-search', PredictiveSearch);


        // collection page new addtocart calling code :
        // function handleSimpleAddToCart(form) {
        //     // Check if form is provided and exists
        //     if (!form) {
        //         console.error("No form provided to handleSimpleAddToCart.");
        //         return;
        //     }

        //     // Use FormData to easily grab 'id' and 'quantity'
        //     const formData = new FormData(form);
        //     // console.log(formData);
        //     const items = [{
        //         id: formData.get('id'),
        //         quantity: formData.get('quantity')
        //     }];
        //     // console.log(items);

        //     // ===================== ADD TO CART FETCH =====================
        //     fetch('/cart/add.js', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json'
        //             },
        //             body: JSON.stringify({
        //                 items
        //             }),
        //         })
        //         .then((res) => res.json())
        //         .then(() => {
        //             // Open Cart Drawer
        //             document.querySelector('.cart-drawer')?.classList.add('showCart');
        //             document.querySelector('.cart-drawer-btn')?.classList.add('openCart');

        //             // Fetch the updated header/cart section HTML
        //             return fetch(window.location.pathname + '?section_id=header');
        //         })
        //         .then((res) => res.text())
        //         .then((html) => {
        //             // Parse the returned HTML
        //             const temp = document.createElement('div');
        //             temp.innerHTML = html;
                    
        //             // Find the updated content using your specific selectors
        //             const newContent = temp.querySelector('.cart-drawer-content');
        //             const newSubtotal = temp.querySelector('.subtotal-price');

        //             // Update the DOM elements if they exist
        //             const existingContent = document.querySelector('.cart-drawer-content');
        //             const existingSubtotal = document.querySelector('.subtotal-price'); 

        //             if (newContent && newSubtotal && existingContent && existingSubtotal) {
        //                 existingContent.innerHTML = newContent.innerHTML;
        //                 existingSubtotal.textContent = newSubtotal.textContent;
        //             } else {
        //                 console.warn("Could not find required elements to update the cart drawer content.");
        //             }
        //         })
        //         // .catch((err) => console.error('Add to cart error:', err));
        // }


function handleSimpleAddToCart (form) {
  event.preventDefault();
  const formData = new FormData(form);
  const productID = formData.get('id');
  const productQTY = formData.get('quantity');
  const submitbutton = form.querySelector('.product-form__submit');
  // console.log(submitbutton);

  fetch('/cart/add.js', {
    method : 'POST',
    headers : {'Content-type' : 'application/json'},
    body : JSON.stringify ({
      items : [{  id : productID,  quantity : productQTY },
      ],
    }),
  })
  .then (res => res.json())
  .then ((data) => {
    // console.log(data);
    // tagupdate();
            producttype(currentProductType);
            document.querySelector('.cart-drawer')?.classList.add('showCart');
            updateCartUI();
  })
   .catch(error => console.error('error:', error));
}

// window.addEventListener('load', tagupdate);

  // function tagupdate() {
  // fetch(window.Shopify.routes.root + 'cart?view=json')
  //   .then(res => res.json())
  //   .then(cartData => {
  //     console.log(cartData);
  //     const activeCartTag = cartData.active_cart_tag;
  //     const allButtons = document.querySelectorAll('.product-form__submit');

  //     allButtons.forEach(button => {
  //       const buttonTag = button.getAttribute('data-product-tag') || "";
  //       if (!activeCartTag || activeCartTag === "") {
  //         showButton(button);
  //       } 
  //       else if (!buttonTag.includes('@')) {
  //         showButton(button);
  //       }
  //       else if (buttonTag === activeCartTag) {
  //         showButton(button);
  //       } 
  //       else {
  //         disableButton(button);
  //       }
  //     });
  //   })
  //   .catch(err => console.error("Cart Fetch Error:", err));
  // }
  //     function showButton(btn) {
  //     btn.disabled = false;
  //     btn.style.opacity = "1";
  //     }
  //     function disableButton(btn) {
  //     btn.disabled = true;
  //     btn.style.opacity = "0.5";
  //     btn.style.cursor = "not-allowed";
  //     }


        // window.addEventListener('load', producttags);
        // setInterval(producttags, 1000); 
        // window.addEventListener('load', () => {
        //   fetch(window.Shopify.routes.root + 'cart?view=tags')
        //     .then(res => res.json())
        //     .then(cartData => {
        //       let tags = [];
        //       cartData.items.forEach(item => { if(item.tags) tags = tags.concat(item.tags); });
        //       window.carttag = tags.join(',');
        //       producttags();
        //     });
        // });

      function producttype(activeType) {
        const allForms = document.querySelectorAll('form.product-form');
        // console.log(allForms);
        allForms.forEach(form => {
          const btn = form.querySelector('.product-form__submit');
          const btnType = btn ? btn.getAttribute('data-product-type') : '';

          if (btnType && btnType !== activeType) {
            btn.style.display = 'none'; 
          }
        });
      }


// ======================= INITIALIZER:add to cart simple forms =======================
function initializeATC() {
  const selectors = ['#main-product-form', 'form.product-form' ];
  const forms = document.querySelectorAll(selectors.join(','));

  forms.forEach((form) => {
    if (!form.dataset.listenerAdded) {
      form.addEventListener('submit',  (e) => {
        e.preventDefault();
         handleSimpleAddToCart(form);
         updateCartUI();
         handleAddToCart(form);
      });
      form.dataset.listenerAdded = "true";
    }
  });
}

// show cart drawer [open drawer / addtocart with drawer]
    function updateCartUI() {
        //  Open drawer
        document.querySelector('.cart-drawer')?.classList.add('showCart');
        document.querySelector('.cart-drawer-btn')?.classList.add('openCart');
       
        return fetch('/?section_id=header')
          .then((r) => r.text())
          .then((html) => {
            const temp = document.createElement('div');
            temp.innerHTML = html;

            const newCartDrawerContent =
              temp.querySelector('.cart-drawer-content') ||
              temp.querySelector('#cart-drawer') ||
              temp.querySelector('[data-cart-drawer]');

            const newSubtotalPrice =
              temp.querySelector('.subtotal-price') ||
              temp.querySelector('[data-subtotal]');

            //  Update UI
            if (newCartDrawerContent) {
              document.querySelector('.cart-drawer-content').innerHTML =
              newCartDrawerContent.innerHTML;
            }
            if (newSubtotalPrice) {
              document.querySelector('.subtotal-price').textContent =
              newSubtotalPrice.textContent;
            }

            if (typeof initializeCartDrawerEvents === 'function') {
              // initializeCartDrawerEvents();
              handleSimpleAddToCart(form);
              initializeATC();
            }
          })
          .catch((err) => console.error('UI Update error:', err));
    }






// =============================== product bundle js [main-product] ===================================
function handleAddToCart(form) {
  if (!form) return;
  const bundleProductId = form.dataset.productId;
  const generateBundleKey = () => 'bundle_' + Date.now();

  const items = [];
  const mainProductId = form.querySelector('#selected-variant-id')?.value;   
  const mainQty = parseInt(form.querySelector('.count')?.value || 1, 10);
  const checkedUpsells = [...form.querySelectorAll('.add-checkbox:checked')];

  const checkedGifts = [...form.querySelectorAll('.gift-checkbox:checked')];

  // Logic to build the 'items' array based on whether upsells are selected
  if (checkedUpsells.length > 0 || checkedGifts.length > 0) {
    const bundleKey = generateBundleKey();

    // main product
    items.push({
      id: mainProductId,
      quantity: mainQty,
      properties: { bundle_id: bundleProductId, bundle_key: bundleKey },
    });

    // upsell products
    checkedUpsells.forEach((cb) => {
      items.push({
        id: cb.value,
        quantity: mainQty,
        properties: { bundle_id: bundleProductId, bundle_key: bundleKey },
      });
    });

        // FREE GIFTS
    checkedGifts.forEach((cb) => {
      items.push({
        id: cb.value,
        quantity: 1,
        properties: {
          bundle_id: bundleProductId,
          bundle_key: bundleKey,
          is_free_gift: true,
        },
      });
    });
  } else {
    items.push({ id: mainProductId, quantity: mainQty });
  }

  // ===================== MAIN ADD TO CART API CALL =====================
  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
    .then((r) => r.json())
    .then(() => {
      // (quick view)
      const quickViewModal = document.getElementById('quick-view-modal');
      if (quickViewModal) {
        quickViewModal.style.display = 'none';
        document.body.classList.remove('no-scroll'); 
      }
      updateCartUI();
      initializeATC(form);
      // handleSimpleAddToCart();
      // document.querySelector('.cart-drawer')?.classList.add('showCart');
    })
    .catch((err) => console.error('Add to cart error:', err));
}



//initialization code
document.addEventListener('DOMContentLoaded', () => {
    initializeATC();
    handleSimpleAddToCart(form);
});

// ============================  MAIN PRODUCT PAGE WITH ADD TO CART FUNCTION CALL =================================
document.addEventListener('DOMContentLoaded', () => {
  const mainForm = document.getElementById('main-product-form');
  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // initializeAddToCartFormsSimple();
      handleSimpleAddToCart(mainForm);
    });
  }
});


//=======================main-product.liquid js code / FOR SELECTED VARIANT WISE UPDATED =======================================

      // Get the JSON data from the script tag
      const inventoryScriptTag = document.getElementById('inventoryscript');
      // console.log(inventoryScriptTag);

      let CustomProductVariants = [];
      // console.log(CustomProductVariants);
      if (inventoryScriptTag) {  
          const productData = JSON.parse(inventoryScriptTag.textContent);
          // console.log(productData);
          window.CustomProductVariants = productData.product_variants;
          // console.log(window.CustomProductVariants);
          CustomProductVariants = productData.product_variants;    
      }

      //   Define Main Product Init Function
        function initProductScripts(context = document) {
          const Input = context.querySelector('input[name="id"]');
          // console.log(Input);
          const CartBtn = context.querySelector('.btn.btn-pink');
          // console.log(CartBtn);
          const SoldOutText = context.querySelector('#SoldOutText');
          const Price = context.querySelector('#ProductPrice');
          // console.log(Price);
          const compareAtPrice = context.querySelector('#CompareAtPrice');
          const variants = window.ProductVariants || [];
          // console.log(variants);
            if (!Input || !CartBtn || !Price || !compareAtPrice) {
              return; 
              }
            const format = Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: window.shopCurrency,
            minimumFractionDigits: 0,
          });


            // FREE GIFT AUTO SELECT FUNCTION
  const handleFreeGifts = (variant) => {
    const giftCheckboxes = document.querySelectorAll('.gift-checkbox');

    // reset
    giftCheckboxes.forEach(cb => cb.checked = false);

    if (!variant) return;

    const optionValue = variant.option1?.toLowerCase();

    let giftCount = 0;

    if (optionValue === 'silver') giftCount = 1;
    else if (optionValue === 'gold') giftCount = 2;
    else if (optionValue === 'black') giftCount = 3;

    giftCheckboxes.forEach((cb, index) => {
      if (index < giftCount) cb.checked = true;
    });
  };



          // ---------- SLIDER UPDATE ----------
          const updateSlider = (color, imageId) => {
            // console.log(updateSlider);
            const images = window.ProductImages[color];
            // console.log(images);
            const slideImages = context.querySelectorAll('.top-slider-inner img');

            if (images && slideImages.length) {
              let image = images.find((img) => img.id == imageId)?.src || images[0].src;
              let indexno = -1;

              slideImages.forEach((img, index) => {
                if (img.src.includes(image)) indexno = index;
              });

              if (indexno !== -1) {
                $(context).find('.top-slider').stop(true).fadeIn(100);
                $(context).find('.bottom-slider').stop(true).fadeIn(100);
                $(context).find('.top-slider').slick('slickGoTo', indexno);
                $(context).find('.bottom-slider').slick('slickGoTo', indexno);
              }
            }
          };
          // console.log(updateSlider);

          // ---------- VARIANT UPDATE ----------
          const updateVariant = (variant) => {
            if (variant) {
              const customVariantData = window.CustomProductVariants.find(v => v.id === variant.id);
              // console.log(customVariantData);
              Input.value = variant.id;
              if(context === document){
                history.replaceState(null, '', `?variant=${variant.id}`);
              }              
              Price.textContent = format.format(variant.price / 100);
              if (variant.compare_at_price > variant.price) {
                compareAtPrice.textContent = format.format(variant.compare_at_price / 100);
                compareAtPrice.style.display = 'inline';
              } else {
                compareAtPrice.style.display = 'none';
              }
              if(variant.available){
                if(customVariantData && customVariantData.inventory_quantity <= 0 && customVariantData.inventory_policy === 'continue'){
                  CartBtn.disabled = false;
                  CartBtn.textContent = 'Pre-Order Product';
                  CartBtn.style.display = 'inline-block';
                  if(SoldOutText)SoldOutText.style.display = 'none';
                }
                else {
                CartBtn.disabled = false;
                CartBtn.textContent = 'Add to Cart';
                CartBtn.style.display = 'inline-block';
                }
              } else{
                console.log("showing sold out text.");
                  CartBtn.disabled = true;
                  CartBtn.textContent = 'SoldOut'; 
              }
               handleFreeGifts(variant);
              const imageId = variant.image_id;
              // console.log(imageId);
              $(context).find('.top-slider').hide();
              $(context).find('.bottom-slider').hide();

              const slick = () => {
                if ($(context).find('.top-slider').hasClass('slick-initialized')) {
                  updateSlider(variant.option1, imageId);
                } else {
                  requestAnimationFrame(slick);
                }
              };
              slick();
              } 
              else {
              console.log("No valid variant is found.");
              Input.value = '';
              CartBtn.disabled = true;
              CartBtn.textContent = 'Unavailable';
              CartBtn.style.display = 'inline-block';
              if (SoldOutText) SoldOutText.style.display = 'none';
              compareAtPrice.style.display = 'none';
            }
          };
          // console.log(updateVariant);

          // ---------- OPTION CHANGE CLICK EVENTS ----------
          context.querySelectorAll('.select-option input[type="radio"]').forEach((r) => {
        r.addEventListener('change', () => {
          const selected = [...context.querySelectorAll('.select-option input[type="radio"]:checked')].map((r) => r.value.trim());
          const variant = variants.find((v) => selected.every((val, index) => v[`option${index + 1}`] === val));
          updateVariant(variant);
        });
      });
          
          
          // ---------- ON PAGE LOAD ----------
        
        if (context === document) {
        const url = new URLSearchParams(window.location.search);
        const variantid = url.get('variant');
        let samevariant = null;
        if (variantid) samevariant = variants.find((v) => v.id == variantid);

        if (samevariant) {
          updateVariant(samevariant);
          const imageid = samevariant.image_id;
          const slides = document.querySelectorAll('.top-slider-inner');
          let matchedIndex = -1;

          slides.forEach((slide, index) => {
            if (slide.dataset.id == imageid) matchedIndex = index;
          });

          if (matchedIndex !== -1) {
            $('.top-slider').slick('slickGoTo', matchedIndex);
            $('.bottom-slider').slick('slickGoTo', matchedIndex);
          }
        }
      }
    }


// ==================== MAIN PAGE INIT  ====================
document.addEventListener("DOMContentLoaded", () => {
  initProductScripts(document);
});
                                                    

//====================================== quick view =========================================================
function initializeQuickView() {
  const quickViewModal = document.getElementById("quick-view-modal");
  // console.log(quickViewModal);
  const quickViewProductData = document.getElementById("quick-view-product-data");
  // console.log(quickViewProductData);

  document.querySelectorAll(".quick-view").forEach((button) => {

    button.addEventListener("click", (e) => {
      e.preventDefault();
      const productHandle = button.dataset.productHandle;
      // console.log(productHandle);
      quickViewModal.style.display = "block";

      fetch(`/products/${productHandle}`)
        .then((res) => res.text())
        .then((html) => {
          const parser = new DOMParser();
          // console.log(parser);
          const doc = parser.parseFromString(html, "text/html");
          // console.log(doc);

          // console.log(doc);
          const mainProductContent = doc.querySelector('section[data-section="main-product"]');
          // console.log(mainProductContent);
          
          quickViewProductData.innerHTML = mainProductContent.innerHTML;

          // global variants
          window.ProductVariants = [];
          window.ProductImages = {};
          // console.log(window.ProductImages); 
          
          const variantScript = doc.querySelector("script#variantscript");
          // console.log(variantScript);
          if (variantScript) {
            try {
              eval(variantScript.textContent);
            }
             catch (err) {
              console.error("Variant script error:", err);
            } 
          }

          setTimeout(() => {
            const topSlider = $(quickViewProductData).find(".top-slider");
            // console.log(topSlider);
            const bottomSlider = $(quickViewProductData).find(".bottom-slider");
            // console.log(bottomSlider);

            if (topSlider.hasClass("slick-initialized")) topSlider.slick("unslick");
            if (bottomSlider.hasClass("slick-initialized")) bottomSlider.slick("unslick");

            if (topSlider.length && bottomSlider.length) {
              topSlider.slick({
                slidesToShow: 1,
                fade: true,
                arrows: false,
                asNavFor: bottomSlider,
              });
              bottomSlider.slick({
                slidesToShow: 4,
                asNavFor: topSlider,
                focusOnSelect: true,
              });
            }

            const event = new CustomEvent("quickview:loaded", {
              detail: { context: quickViewProductData },
            });
            document.dispatchEvent(event);
          
            const quickForm = quickViewProductData.querySelector('#main-product-form');
            // console.log(quickForm);
            if (quickForm) {
              quickForm.addEventListener('submit', (e) => {
                e.preventDefault();
                initializeATC(quickForm);
              });
            }
          }, 200);
        });
    }); 
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initializeQuickView();
  // Close button & outside click listeners
  const quickViewModal = document.getElementById("quick-view-modal");
  document.querySelector(".close-button")?.addEventListener("click", () => {
    quickViewModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === quickViewModal) quickViewModal.style.display = "none";
  });
});


// ==================== QUICK VIEW EVENT LISTENER ====================
document.addEventListener("quickview:loaded", (e) => {   
   const context = e.detail.context;   
   if (context) initProductScripts(context); 
});


// ================= second allow ================
// document.addEventListener('DOMContentLoaded', () => {
//   initProductScripts2(context);
// });



// // main-collection page js =====================================================
// document.addEventListener("DOMContentLoaded", () => {
//   // Pass the main container as context
//   const productGrid = document.querySelector("#productGrid");
//   if (productGrid) {
//     initProductScripts2(productGrid);
//   }
// });

// function initProductScripts2(context) {
//   // Maintain selected variant state per product
//   const svariant = {};
//   // console.log(svariant);

//   // Handle color/size swatch clicks
//   context.querySelectorAll(".card-color-swatch, .card-size-swatch").forEach((swatch) => {
//     swatch.addEventListener("click", (e) => {
//       e.preventDefault();
//       const $this = e.target;
//       const card = $this.closest(".product-card");
//       if (!card) return;

//       const handleEl = card.querySelector(".prod-title a");
//       if (!handleEl) return;
//       const handle = handleEl.textContent.trim();
//       const title = $this.getAttribute("title");

//       const variantDataScript = card.querySelector("script.variant-data");
//       if (!variantDataScript) return;
//       const variants = JSON.parse(variantDataScript.innerHTML);

//       const priceEl = card.querySelector("#price2");
//       const compareEl = card.querySelector("#compareatprice2");

//       svariant[handle] = svariant[handle] || {};

//       // Handle color selection
//       if ($this.classList.contains("card-color-swatch")) {
//         card.querySelectorAll(".card-color-swatch").forEach((el) => el.classList.remove("selected"));
//         $this.classList.add("selected");
//         svariant[handle].color = title;
//       }

//       // Handle size selection
//       if ($this.classList.contains("card-size-swatch")) {
//         card.querySelectorAll(".card-size-swatch").forEach((el) => el.classList.remove("selected"));
//         $this.classList.add("selected");
//         svariant[handle].size = title;
//       }

//       const selected = svariant[handle];

//       // Find matching variant
//       const samevariant = variants.find((v) => {
//         const colorMatch = v.option1 === selected.color || !selected.color;
//         const sizeMatch = v.option2 === selected.size || !selected.size;
//         return colorMatch && sizeMatch;
//       });

//       // Update price in card
//       if (samevariant && priceEl && compareEl) {
//         const newPrice = Shopify.formatMoney(samevariant.price, Shopify.money_format);
//         priceEl.textContent = newPrice;

//         if (samevariant.compare_at_price && samevariant.compare_at_price > samevariant.price) {
//           const newCompare = Shopify.formatMoney(samevariant.compare_at_price, Shopify.money_format);
//           compareEl.textContent = newCompare;
//           compareEl.style.display = "inline";
//         } else {
//           compareEl.style.display = "none";
//         }
//       }
//     });
//   });

//   // Handle add to cart button
//   context.querySelectorAll(".product-form__submit").forEach((btn) => {
//     btn.addEventListener("click", (e) => {
//       // e.preventDefault();
//       const form = btn.closest("form");
//       const card = btn.closest(".product-card");
//       if (!form || !card) return;

//       const handleEl = card.querySelector(".prod-title a");
//       if (!handleEl) return;
//       const handle = handleEl.textContent.trim();
//       const selected = svariant[handle] || {};

//       const variantDataScript = card.querySelector("script.variant-data");
//       if (!variantDataScript) return;
//       const variants = JSON.parse(variantDataScript.innerHTML);

//       const samevariant = variants.find((v) => {
//         const colorMatch = v.option1 === selected.color || !selected.color;
//         const sizeMatch = v.option2 === selected.size || !selected.size;
//         return colorMatch && sizeMatch;
//       });

//       if (samevariant) {
//         const inputId = form.querySelector('input[name="id"]');
//         if (inputId) inputId.value = samevariant.id;
//       }
//       handleSimpleAddToCart(form);
//       updateCartUI();
//     });
//   });
// }
// console.log(initProductScripts2);

// ====================== product recommendation js code =========================

 const productRecommendationsSection = document.querySelector('#dynamic-recommendations');
 //  console.log(productRecommendationsSection);
  const handleIntersection = (entries, observer) => {
    if (!entries[0].isIntersecting) return;
    observer.unobserve(productRecommendationsSection);
    const url = productRecommendationsSection.dataset.url;
    // console.log(url);
    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        const html = document.createElement('div');
        html.innerHTML = text;
        const newRecommendations = html.querySelector('#dynamic-recommendations .row');
        // console.log(newRecommendations);
        const existingContainer = productRecommendationsSection.querySelector('.row');
        if (newRecommendations && newRecommendations.innerHTML.trim().length > 0) {
          existingContainer.innerHTML = newRecommendations.innerHTML;
        }
        initializeQuickView();
        initializeATC();
      });
  };
  // console.log(handleIntersection);

  if (productRecommendationsSection) {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '200px 0px 0px 0px',
    });
    observer.observe(productRecommendationsSection);
  }



// ==================================== header . cart-drawer [add cart-drawer , cart drawer in bundle] ========================================

  // document.addEventListener('DOMContentLoaded', () => {
  //   const fmt = (v) =>
  //     new Intl.NumberFormat('en-IN', { style: 'currency', currency: Shopify.currency.active }).format(v / 100);

  //   document.addEventListener('click', async (e) => {
  //     const btn = e.target.closest('.adjust');
  //     if (!btn) return;

  //     const row = btn.closest('.products');
  //     console.log(row);
  //     const lineKey = row.querySelector('input[name="id"]').value; 
  //     {% comment %} value = "{{ item.key }}" {% endcomment %}
  //     console.log(lineKey);// use key instead of index
  //     const currentQty = parseInt(row.querySelector('.count').value);
  //     {% comment %} //value="{{ item.quantity }}" {% endcomment %}
  //     console.log(currentQty);
  //     const inventory = parseInt(row.dataset.inventory);
  //     console.log(inventory);

  //     let qty = currentQty + (btn.classList.contains('plus') ? 1 : -1);
  //     console.log(qty);
  //     if (qty < 1) qty = 1;

  //     if (btn.classList.contains('plus') && qty > inventory) {
  //       cartmessage('No more products can be added');
  //       return;
  //     }

  //     const cart = await (await fetch('/cart.js')).json();
  //     console.log(cart);
  //     const targetItem = cart.items.find((it) => it.key === lineKey);
  //     console.log(targetItem);
  //     const bundleKey = targetItem?.properties?.bundle_key;
  //     console.log(bundleKey);

  //     let updates = {};
  //     if (bundleKey) {
  //       cart.items.forEach((it) => {
  //         if (it.properties?.bundle_key === bundleKey) {
  //           updates[it.key] = qty;
  //         }
  //       });
  //     } else {
  //       updates[lineKey] = qty;
  //     }

  //     const newCart = await (
  //       await fetch('/cart/update.js', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ updates }),
  //       })
  //     ).json();

  //     // refresh drawer DOM
  //     const html = await (await fetch(`${location.pathname}?section_id=header`)).text();
  //     const temp = document.createElement('div');
  //     temp.innerHTML = html;

  //     document.querySelector('.cart-drawer-content').innerHTML = temp.querySelector('.cart-drawer-content').innerHTML;
  //     document.querySelector('.subtotal-price').textContent = temp.querySelector('.subtotal-price').textContent;
  //   });
   


  //   function cartmessage(msg) {
  //     const msgBox = document.getElementById('cart-message');
  //     msgBox.textContent = msg;
  //     msgBox.style.display = 'block';
  //     msgBox.style.opacity = '1';
  //     setTimeout(() => {
  //       msgBox.style.opacity = '0';
  //       setTimeout(() => (msgBox.style.display = 'none'), 300);
  //     }, 2000);
  //   }
  // });

  
// ============================== main-cartpage.js - remove api code ================================

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.delete-btn');
    if (!btn) return;

    e.preventDefault();

    const line = parseInt(btn.dataset.line);
    if (!line) return;

    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        line: line,
        quantity: 0,
      }),
    })
      .then((res) => res.json())
      .then((cart) => {
        //  Refresh cart 
        if(cart.item_count === 0){
          // enableButton(button);
         const formButtons = document.querySelectorAll('.product-form__submit');
         formButtons.forEach(button => {
          showButton(button);
          button.style.display = 'block';
         });
        }
       
        refreshCartDrawer();
        // tagupdate(); // if cart === 0 , all addtocart button is show
        if (typeof loadCartRecommendations === 'function') {
          loadCartRecommendations();
        }
      })
      .catch((err) => console.error(err));
    });
});

function refreshCartDrawer() {
  fetch('/?sections=header')
    .then((res) => res.json())
    .then((sections) => {
      const newDrawer = sections['header'];
      if (!newDrawer) return;

      const parser = new DOMParser();
      const doc = parser.parseFromString(newDrawer, 'text/html');

      const newContent = doc.querySelector('.cart-drawer');
      const currentContent = document.querySelector('.cart-drawer');

      if (newContent && currentContent) {
        currentContent.innerHTML = newContent.innerHTML;
        // tagupdate();
      }
    })
    .catch(console.error);
}

// ======================== main-cartpage.js ==============================
  document.addEventListener('DOMContentLoaded', () => {
    const fmt = (v) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: Shopify.currency.active,
      }).format(v / 100);

    const updateTotals = (cart) => {
      document.querySelector('.subtotal .cart-prod-price h5').textContent = fmt(cart.items_subtotal_price);
      document.querySelector('.total-price h5').textContent = fmt(cart.total_price);
    };
    // console.log(updateTotals);

    const updateRow = (row, item) => {
      row.querySelector('input.count').value = item.quantity;
      row.querySelector('.col-2.col-s-4 .cart-prod-price h4').textContent = fmt(item.line_price);
    };

    const Bundle = (bundleKey, qty) =>
      fetch('/cart.js')
        .then((r) => r.json())
        .then((cart) => {
          const updates = {};
          cart.items.forEach((i) => {
            if (i.properties?.bundle_key === bundleKey) updates[i.key] = qty;
          });
          return Object.keys(updates).length
            ? fetch('/cart/update.js', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ updates }),
              }).then((r) => r.json())
            : null;
        });

    const changeQty = (row, qty) => {
      const bundleKey = row.dataset.bundleKey;
      // console.log(bundleKey);
      if (bundleKey) {
        document
          .querySelectorAll(`.cart-prod-detail[data-bundle-key="${bundleKey}"] input.count`)
          .forEach((inp) => (inp.value = qty));
        Bundle(bundleKey, qty).then((cart) => {
          if (!cart) return;
          updateTotals(cart);
          cart.items.forEach((i, idx) => {
            if (i.properties?.bundle_key === bundleKey) {
              const row = document.querySelectorAll('.cart-prod-detail')[idx];
              if (row) updateRow(row, i);
            }
          });
        });
      } else {
        const idx = [...document.querySelectorAll('.cart-prod-detail')].indexOf(row) + 1;
        // console.log(idx);
        fetch('/cart/change.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ line: idx, quantity: qty }),
        })
          .then((r) => r.json())
          .then((cart) => {
            updateTotals(cart);
            const item = cart.items[idx - 1];
            if (item) updateRow(row, item);
          });
      }
    };

    // qty input change
    document.body.addEventListener('change', (e) => {
      if (e.target.matches('.cart-prod-qty input.count')) {
        const row = e.target.closest('.cart-prod-detail');
        const qty = Math.max(0, +e.target.value || 0);
        changeQty(row, qty);
      }
    });

    // plus / minus click
    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('.adjust');
      if (!btn) return;
      const row = btn.closest('.cart-prod-detail');
      const input = row.querySelector('input.count');
      let qty = +input.value + (btn.classList.contains('plus') ? 1 : -1);
      qty = Math.min(Math.max(0, qty), +row.dataset.max);
      changeQty(row, qty);
    });
  });


// ========================== load more functionality ==========================

 document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("product-grid");
  const loadMoreBtn = document.getElementById("LoadMoreBtn");
  const loadingSpinner = document.querySelector(".loading-spinner");
  const nextPageLink = document.getElementById("next-page-url-holder");
  const wrapper = document.querySelector(".load-more-wrapper");
  // initializeAddToCartButtons();
  // initializeAddToCartFormsSimple();
  if (!productGrid || !nextPageLink) {
    if (wrapper) wrapper.style.display = "none";
    return;
  }

  let isFetching = false;
  const fetchNextPage = () => {
    if (isFetching || !nextPageLink.href) return;

    isFetching = true;
    if (loadingSpinner) loadingSpinner.style.display = "block";
    if (loadMoreBtn) loadMoreBtn.disabled = true;

    fetch(nextPageLink.href)
      .then((res) => res.text())
      .then((html) => {
        const temp = document.createElement("div");
        temp.innerHTML = html;

        const newGrid = temp.querySelector("#product-grid");
        const newNextLink = temp.querySelector("#next-page-url-holder");

        // Add new products
        if (newGrid) {
          [...newGrid.children].forEach((item) => productGrid.appendChild(item));
        }

        initializeQuickView();
        initializeATC();
        
        // Update next page URL
        if (newNextLink?.href) {
          nextPageLink.href = newNextLink.href;
        } else {
          // No more pages
          wrapper.style.display = "none";
          window.infiniteScrollObserver?.disconnect();
        }
      })
      .finally(() => {
        isFetching = false;
        if (loadingSpinner) loadingSpinner.style.display = "none";
        if (loadMoreBtn) loadMoreBtn.disabled = false;
      });
          
  };

  // ============================
  // LOAD MORE BUTTON MODE
  // ============================
  if (wrapper?.dataset.paginationType === "load_more") {
    wrapper.style.display = "block";
    loadMoreBtn?.addEventListener("click", fetchNextPage);

  }

  // ============================
  // INFINITE SCROLL MODE
  // ============================
  else if (wrapper?.dataset.paginationType === "infinite_scroll") {
    wrapper.style.display = "block";
    if (loadMoreBtn) loadMoreBtn.style.display = "none";

    const trigger = document.getElementById("infinite-scroll-trigger");
    if (trigger) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!isFetching && entries.some((e) => e.isIntersecting)) {
            fetchNextPage();
          }
        },
        { rootMargin: "10px", threshold: 0.9 }
      );

      window.infiniteScrollObserver = observer;
      observer.observe(trigger);
    }
  } else {
    if (wrapper) wrapper.style.display = "none";
  }
});

// ==================== pre-order product ======================================= 
// document.addEventListener('DOMContentLoaded', function() {
//     const productForm = document.getElementById('main-product-form');
//     const addToCartButton = document.getElementById('AddToCartButton');
//     const soldOutText = document.getElementById('SoldOutText');
//     if (!productForm || !addToCartButton) return;
//     function updateButtonStatus(variant) {
//       if (variant) {
//         if (variant.available) {
//           addToCartButton.style.display = '';
//           addToCartButton.textContent = 'Add To Cart';
//           if (soldOutText) soldOutText.style.display = 'none';
//         } else if (variant.inventory_policy === 'continue') {
//           addToCartButton.style.display = '';
//           addToCartButton.textContent = 'Pre-Order';
//           if (soldOutText) soldOutText.style.display = 'none';
//         } else {
//           addToCartButton.style.display = 'none';
//           if (soldOutText) soldOutText.style.display = '';
//         }
//       } else {
//         addToCartButton.style.display = 'none';
//         if (soldOutText) soldOutText.style.display = '';
//       }
//     }
//     console.log(updateButtonStatus);
//     const initialVariantId = document.getElementById('selected-variant-id').value;
//     console.log(initialVariantId);
//     document.addEventListener('variantChange', function(event) { 
//         const variant = event.detail.variant;
//         updateButtonStatus(variant);
//     });    
//   });


      // // // image zoom-in zoom-out :

      // document.addEventListener('DOMContentLoaded', () => {
      //   // Select the containers, not just the images, because we track movement within the container
      //   const zoomContainers = document.querySelectorAll('.zoom-container');
      //   // console.log('Zoom containers found:', zoomContainers.length);

      //   zoomContainers.forEach(container => {
      //     const img = container.querySelector('[data-zoomable="true"]');
          
      //     if (!img) return;

      //     container.addEventListener('mouseenter', () => {
      //       img.classList.add('is-zoomed');
      //     });

      //     container.addEventListener('mouseleave', () => {
      //       img.classList.remove('is-zoomed');
      //       img.style.transformOrigin = 'center center'; 
      //     });

      //     container.addEventListener('mousemove', (e) => {
      //       const containerRect = container.getBoundingClientRect();
      //       const x = e.clientX - containerRect.left; 
      //       const y = e.clientY - containerRect.top;  

      //       const xPercent = (x / containerRect.width) * 100;
      //       const yPercent = (y / containerRect.height) * 100;

      //       img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      //     });
      //   });
      //   const Lightbox = document.querySelectorAll('[data-action="open-lightbox-trigger"]');
      //   const modal = document.getElementById("product-lightbox-modal");
      //   const modalImg = document.getElementById("lightbox-image");
      //   const closeBtn = document.querySelector(".close-button");

      //   if (modal && Lightbox.length > 0) {
      //     Lightbox.forEach(trigger => {
      //       trigger.addEventListener('click', () => {
      //         const fullSrc = trigger.querySelector('.product-zoom-img').getAttribute('data-full-src');
      //         // console.log(fullSrc);
      //         if (fullSrc) {
      //           modal.style.display = "block";
      //           modalImg.src = fullSrc;
      //         }
      //       });
      //     });
          
      //     if (closeBtn) {
      //         closeBtn.addEventListener('click', closeLightbox);
      //     }


      //     window.addEventListener('click', (event) => {
      //       if (event.target === modal) {
      //         closeLightbox();
      //       }
      //     });

      //     function closeLightbox() {
      //         modal.style.display = "none";
      //     }
      //   }
      // });



  // //gift card functionality :
  // document.addEventListener("DOMContentLoaded", function(){

  //   const emailInput = document.getElementById("gift_email");
  //   console.log(emailInput);
  //   const note = document.querySelector(".gift-note");
  //   console.log(note);

  //   if(!emailInput) return;

  //   emailInput.addEventListener("input", function(){
  //     if(emailInput.value.includes("@")){
  //       note.style.display = "block";
  //     }
  //     else {
  //       note.style.display = "none";
  //     }
  //   })

  // })


// compare.js.liquid (simplified example)

  document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('compare-popup');
    // console.log(popup);

    function updatbutton(){
      const currentProducts = JSON.parse(localStorage.getItem('compareProducts')) || [];
      const id = currentProducts.map(p => p.id.toString());
      const allbutton = document.querySelectorAll('.compare-product-button');

      allbutton.forEach(btn => {
        const buttonid = btn.dataset.productId.toString();

        if(id.includes(buttonid)){
          btn.innerText = "Alredy add";
          btn.disabled = true;
          btn.style.backgroundcolor = "#ddd";
          
        } else {
          btn.innerText = "Add Compare";
          btn.disabled = false;
          btn.style.backgroundcolor = "";
         }
      });
    }

    function updatePopup() {
    const productsToCompare = JSON.parse(localStorage.getItem('compareProducts')) || [];
    // console.log(productsToCompare);
    const countText = document.getElementById('compare-count-text');
    // console.log(countText);
    // const popup = document.getElementById('compare-popup');

    updatbutton();

    if (productsToCompare.length === 0) {
        popup.style.display = 'none';
        return;
    }
    const count = productsToCompare.length;
    // console.log(count);
    if (count === 1) {
        countText.innerHTML = `<strong>1</strong> product is added to compare.`;
    } else {
        countText.innerHTML = `<strong>${count}</strong> products are added to compare.`;
    }
    popup.style.display = 'block';
    }
    
    // Event: 
    document.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('compare-product-button')) {
            const btn = e.target;
            // console.log(btn);
            let currentProducts = JSON.parse(localStorage.getItem('compareProducts')) || [];
            // console.log(currentProducts);
            const productData = {
              id: btn.dataset.productId.toString(),
              title: btn.dataset.productTitle,
              vendor: btn.dataset.productVendor,
              price: btn.dataset.productPrice,               
              type: btn.dataset.productType,
              image: btn.dataset.productImage,
              services: btn.dataset.productServices || '-', 
              product2: btn.dataset.productProduct2 || '-',
              product7: btn.dataset.productProduct7 || '-',
              test1: btn.dataset.producttest1 || '-',
              heding_title: btn.dataset.heding_title || '-',
              available: btn.dataset.productAvailable,
            };
            
            // console.log(productData);

            const productcheck = currentProducts.some(p => p.id === productData.id);
            // console.log('product check??', productcheck);

            if (!productcheck) {
                currentProducts.push(productData);
                localStorage.setItem('compareProducts', JSON.stringify(currentProducts));
                updatePopup();
            } else {
                alert('alredy this product are added.');
            }
          }
       });

      // Close and Redirect Events
      document.getElementById('close-popup')?.addEventListener('click', () => popup.style.display = 'none');
      document.getElementById('view-comparison-page')?.addEventListener('click', () => {
        window.location.href = '/pages/compare';
      });

      document.getElementById('clear-all-button').addEventListener('click', () => {
      localStorage.removeItem('compareProducts');
      updatePopup();
    })
    updatePopup(); 
});


//cart-drawer section in add to recommendation product:

    //   function loadCartRecommendations() {
    //   const container = document.querySelector('#cart-recommendations');
    //   // console.log(container);
    //     fetch('/cart.js')
    //     .then(response => response.json())
    //     .then(cart => {
    //       if (cart.items.length > 0) {
    //         const productId = cart.items[0].product_id; 
    //         // console.log(productId);
    //         const limit = 4;
    //         // console.log(limit);        
    //         fetch(`/recommendations/products.json?product_id=${productId}&limit=${limit}`)
    //           .then(response => response.json())
    //           .then(({ products }) => {
    //             console.log(products);
    //             if (products.length > 0) {      
    //               let html = '<h4 class="recommendation-title" style="color:blue;">You Might Also Like</h4>';
    //               products.forEach(product => {
    //                 html += `
    //                   <div class="recommendation-product" style="display: flex;">
    //                     <img src="${product.featured_image}" alt="${product.title}">
    //                     <div class="recommendation-info">
    //                       <h5>${product.title}</h5>
    //                       <p>${(product.price / 100).toFixed(2)} ${cart.currency}</p>
    //                       <button class="addtocart-btn" onclick="recommendedcart(${product.variants[0].id})">
    //                        Add to Cart
    //                       </button>
    //                     </div>
    //                   </div>`;
    //               });
    //               container.innerHTML = html;
    //             }
    //           });
    //           }
    //            else {
    //         container.innerHTML = ''; 
    //       } 
    //     });
    // }

    //cart-drawer in recommendations product :
// function loadCartRecommendations() {
//   const container = document.querySelector('#cart-recommendations');
//   fetch('/cart.js')
//     .then(response => response.json())
//     .then(cart => {
   
//       if (cart.items.length === 0) {
//         container.innerHTML = ''; 
//       }

//       const productId = cart.items[0].product_id; 
//       fetch(`/recommendations/products.json?product_id=${productId}&limit=4`)
//         .then(response => response.json())
//         .then(({ products }) => {
//           if (products.length > 0) {      
//             let html = '<h4 class="recommendation-title">You Might Also Like</h4>';
//             products.forEach(product => {
//               html += `
//                 <div class="recommendation-product" style="display: flex; margin-bottom:10px;">
//                   <img src="${product.featured_image}" width="50">
//                   <div class="recommendation-info">
//                     <h5>${product.title}</h5>
//                     <p>${(product.price / 100).toFixed(2)}</p>
//                     <button type="button" class="addtocart-btn" onclick="recommendedcart(${product.variants[0].id})">
//                      Add to Cart
//                     </button>
//                   </div>
//                 </div>`;
//             });
//             container.innerHTML = html;
//           } else {
//             container.innerHTML = '';
//           }
//         });
//     });
// }

//       function recommendedcart(variantId) {
//         fetch('/cart/add.js',{
//           method: 'POST',
//           headers: {'Content-type' : 'application/json'},
//           body: JSON.stringify({ id: variantId, quantity: 1 })
//         })
//         .then(res => res.json())
//         .then((item) => {
//           // location.reload();
//           console.log('product added:', item);
//            loadCartRecommendations();
//           refreshCartDrawer(); 
//         })
//         .catch(error => console.error('error:', error))
//       }
      
//       function refreshCartDrawer() {
//         fetch('/?sections=header')
//         .then(res => res.json())
//         .then(data => {
//       const parser = new DOMParser();
//       const doc = parser.parseFromString(data.header, 'text/html');
//       console.log(doc);

//       const newDrawer = doc.querySelector('.cart-drawer');
//       const oldDrawer = document.querySelector('.cart-drawer');
//       // loadCartRecommendations();
//       if (newDrawer && oldDrawer) {
//         oldDrawer.innerHTML = newDrawer.innerHTML;
//       }
//       loadCartRecommendations();
//     });
// }

// document.addEventListener('click', loadCartRecommendations, recommendedcart);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    

// document.addEventListener('DOMContentLoaded', () => {
//     loadCartRecommendations();
//     recommendedcart();
// });


