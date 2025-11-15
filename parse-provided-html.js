const cheerio = require('cheerio');
const fs = require('fs');

// Read the HTML you provided
const html = fs.readFileSync('provided-categories.html', 'utf8');
const $ = cheerio.load(html);

const categories = [];

// Each flyout-w contains a main category and its submenu
$('.flyout-w').each((index, flyoutContainer) => {
  const $container = $(flyoutContainer);
  
  // Get main category
  const $mainLink = $container.find('> .flyout > a.itm').first();
  const mainCategoryName = $mainLink.find('.text').text().trim();
  const mainCategoryUrl = $mainLink.attr('href');
  
  if (!mainCategoryName) return;

  const category = {
    name: mainCategoryName,
    url: mainCategoryUrl,
    subcategories: []
  };

  // Find the submenu
  const $submenu = $container.find('> .flyout > .sub');
  
  if ($submenu.length > 0) {
    // Get subcategories
    $submenu.find('.cat').each((subIndex, catElement) => {
      const $cat = $(catElement);
      const subCategoryTitle = $cat.find('a.tit').text().trim();
      const subCategoryUrl = $cat.find('a.tit').attr('href');
      
      if (subCategoryTitle) {
        const subcategory = {
          name: subCategoryTitle,
          url: subCategoryUrl,
          items: []
        };

        // Get sub-items
        $cat.find('a.s-itm').each((itemIndex, itemElement) => {
          const $item = $(itemElement);
          const itemName = $item.text().trim();
          const itemUrl = $item.attr('href');
          
          if (itemName) {
            subcategory.items.push({
              name: itemName,
              url: itemUrl
            });
          }
        });

        category.subcategories.push(subcategory);
      }
    });
  }

  categories.push(category);
});

console.log(`Found ${categories.length} categories`);
console.log(JSON.stringify(categories.slice(0, 2), null, 2));
