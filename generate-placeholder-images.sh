#!/bin/bash

# Create placeholder images for missing months
echo "Creating placeholder images for missing months..."

months=("march" "april" "may" "june" "july" "august" "september" "october")

for month in "${months[@]}"; do
  echo "Creating placeholder for $month"
  
  # Create a colored box with text using ImageMagick if available
  if command -v convert &> /dev/null; then
    convert -size 800x600 canvas:lightblue -gravity Center -pointsize 72 \
      -annotate 0 "$month" "public/backgrounds/$month.jpg"
  else
    # If ImageMagick isn't available, create an empty file
    touch "public/backgrounds/$month.jpg"
    echo "ImageMagick not found. Created empty file for $month."
  fi
done

echo "Done creating placeholder images"
