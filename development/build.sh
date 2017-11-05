#!/bin/zsh
electron-packager ./static Flex2 --platform=win32 --arch=x64 \
    --asar --overwrite --package-manager yarn \
    --win32metadata.CompanyName="Flex 2" \
    --win32metadata.FileDescription="Flex 2" \
    --win32metadata.ProductName="Flex 2" \
    --appCopyright="public domain" \
    --icon=./development/icon.ico
electron-packager ./static Flex2 --platform=win32 --arch=ia32 \
    --asar --overwrite --package-manager yarn \
    --win32metadata.CompanyName="Flex 2" \
    --win32metadata.FileDescription="Flex 2" \
    --win32metadata.ProductName="Flex 2" \
    --appCopyright="public domain" \
    --icon=./development/icon.ico
electron-packager ./static Flex2 --platform=linux --arch=x64 --asar --overwrite --package-manager yarn
electron-packager ./static Flex2 --platform=darwin --arch=x64 --asar --overwrite --package-manager yarn

zip -r flex2-win32-ia32.zip Flex2-win32-ia32
rm -r Flex2-win32-ia32
zip -r flex2-win32-x64.zip Flex2-win32-x64
rm -r Flex2-win32-x64
tar cfvz flex2-linux-x64.tar.gz Flex2-linux-x64
rm -r Flex2-linux-x64
tar cfvz flex2-darwin-x64.tar.gz Flex2-darwin-x64
rm -r Flex2-darwin-x64
