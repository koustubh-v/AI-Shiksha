import re

with open("src/index.css", "r") as f:
    css = f.read()

marquee_css = """
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 25s linear infinite;
  min-width: max-content;
}
"""

if "marquee_25s" not in css and "animate-marquee" not in css:
    css += marquee_css
    with open("src/index.css", "w") as f:
        f.write(css)
