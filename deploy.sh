git pull
yarn run build
pm2 delete "giftmarketplace-web"
pm2 start npm --name "giftmarketplace-web" -- start
