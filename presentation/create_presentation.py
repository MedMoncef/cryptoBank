from pptx import Presentation
from pptx.util import Inches, Pt
from datetime import date

# Create a new presentation
prs = Presentation()

# --------- Slide 1: Title Slide ---------
slide_layout = prs.slide_layouts[0]  # Title slide layout
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Crypto Bank Project"
slide.placeholders[1].text = "Your Name\nDate: {:%B %d, %Y}\nCourse Name".format(date.today())

# --------- Slide 2: Introduction ---------
slide_layout = prs.slide_layouts[1]  # Title and Content layout
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Introduction"
content = (
    "Overview of Crypto Bank project:\n"
    "• Purpose: Secure, efficient crypto banking solution\n"
    "• Technologies: Node.js, Next.js, Database, and more\n"
    "• Goal: Seamless crypto and fiat transactions"
)
slide.placeholders[1].text = content

# --------- Slide 3: Features Overview ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Features Overview"
features = (
    "• User Account Management\n"
    "• Wallet System\n"
    "• KYC Verification\n"
    "• Merchant Transactions\n"
    "• Admin & Staff Management\n"
    "• Transaction Processing (Crypto & Fiat)"
)
slide.placeholders[1].text = features

# --------- Slide 4: Class Diagram ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Class Diagram"
diagram_text = (
    "Class Diagram Overview:\n"
    "• User, Wallet, KYC, Merchant, Admin, Staff, Transaction\n"
    "• Relationships and key methods illustrated\n"
    "• (Insert your diagram image below or reference it)"
)
slide.placeholders[1].text = diagram_text

# Optional: Insert image for class diagram if available
# Uncomment and modify the path if you have an image:
# left = Inches(1); top = Inches(3); width = Inches(8)
# slide.shapes.add_picture("path_to_class_diagram_image.png", left, top, width=width)

# --------- Slide 5: System Architecture ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "System Architecture"
architecture = (
    "• Frontend: Next.js\n"
    "• Backend: Node.js API server\n"
    "• Database: SQL/NoSQL\n"
    "• Communication: RESTful API endpoints\n"
    "• Security: Authentication, encryption, etc."
)
slide.placeholders[1].text = architecture

# --------- Slide 6: User Flow ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "User Flow"
user_flow = (
    "1. User Registration & KYC Verification\n"
    "2. Wallet Creation & Funding\n"
    "3. Transaction Initiation (Crypto/Fiat)\n"
    "4. Merchant Payment Processing\n"
    "5. Admin/Staff Oversight & Support"
)
slide.placeholders[1].text = user_flow

# --------- Slide 7: Technologies Used ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Technologies Used"
tech = (
    "• Frontend: Next.js, Tailwind CSS (or another UI framework)\n"
    "• Backend: Node.js (Express/NestJS)\n"
    "• Database: MongoDB/PostgreSQL (or others)\n"
    "• Authentication: JWT, OAuth\n"
    "• Payment Integration: Crypto APIs (e.g., Binance, Coinbase)\n"
    "• Tools: Docker, CI/CD pipelines"
)
slide.placeholders[1].text = tech

# --------- Slide 8: Challenges & Solutions ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Challenges & Solutions"
challenges = (
    "• Security Concerns: Implement robust encryption & authentication\n"
    "• Transaction Speed: Optimize API performance\n"
    "• Scalability: Design for future growth and multi-chain support"
)
slide.placeholders[1].text = challenges

# --------- Slide 9: Future Enhancements ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Future Enhancements"
future = (
    "• Multi-chain support\n"
    "• Staking & lending features\n"
    "• Improved UI/UX design\n"
    "• Advanced analytics & reporting"
)
slide.placeholders[1].text = future

# --------- Slide 10: Conclusion ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Conclusion"
conclusion = (
    "Crypto Bank project aims to revolutionize the way digital transactions are handled.\n"
    "With a focus on security, scalability, and user experience, this platform is poised for success."
)
slide.placeholders[1].text = conclusion

# --------- Slide 11: Demo (Optional) ---------
slide = prs.slides.add_slide(slide_layout)
slide.shapes.title.text = "Demo"
demo = (
    "• Screenshots of the application in action\n"
    "• Live demo URL (if applicable)\n"
    "• Key interactions and user interface highlights"
)
slide.placeholders[1].text = demo

# Save the presentation to a file
prs.save("CryptoBankPresentation.pptx")
print("Presentation created successfully as 'CryptoBankPresentation.pptx'")