
//Product Categories Main Description Prompt
export const prompt = (category) =>
    `Generate a compelling and detailed product description for ${category}. Highlight its key features, benefits, and unique selling points. Use persuasive language to appeal to the target audience. Ensure the description is engaging, easy to read, and optimized for SEO. Include specifications if necessary and a call-to-action to encourage conversions. In 50 word and i want to in single paragraph based description.remove extra text like "**50 Words:**,and options etc . and make it look like a normal paragraph.`;

//Product Categories
export const categories = [
    { id: 1, name: "Acrylic Photos" },
    { id: 2, name: "Fridge Magnets" },
    { id: 3, name: "Acrylic Collages" },
    { id: 4, name: "Wall Clocks" },
];

export const products = {
    "Acrylic Photos": [
        {
            title: "Acrylic Photo",
            description: "Discover premium acrylic photo products for decor.",
            path: "/acrylic",
            image: "/assets/02 FRAM.jpg",
        },
        {
            title: "Clear Acrylic Photo",
            description: "Get high-quality transparent acrylic photo frames.",
            path: "/clear-acrylic",
            image: "assets/03 FRAM.jpg",
        },
    ],
    "Fridge Magnets": [
        {
            title: "Round Fridge Magnet",
            description: "Beautiful round-shaped acrylic fridge magnets.",
            path: "/fridge-magnets/rounded",
            image: "https://s.omgs.in/wp-content/uploads/2024/01/circle-shape-min-768x768.jpg",
        },
        {
            title: "Round Corners Fridge Magnets",
            description: "Custom round-corner fridge magnets with vibrant prints.",
            path: "/fridge-magnets/round-corners",
            image: "assets/07 FRAM.jpg",
        },
        {
            title: "Leaf Shape Fridge Magnets",
            description: "Unique leaf-shaped acrylic magnets for decoration.",
            path: "/fridge-magnets/leaf",
            image: "https://s.omgs.in/wp-content/uploads/2024/01/Leaf-2-shape-min-2048x2048.jpg",
        },
        {
            title: "Square Fridge Magnets",
            description: "Elegant square-shaped acrylic fridge magnets.",
            path: "/fridge-magnets/square",
            image: "https://s.omgs.in/wp-content/uploads/2024/01/square-shape-min-2048x2048.jpg",
        },
    ],
    "Acrylic Collages": [
        {
            title: "5 Pics Collage Premium Acrylic Wall Photo",
            description: "Premium acrylic wall collage with 5 photo slots.",
            path: "/collage/5-pics",
            image: "https://s.omgs.in/wp-content/uploads/2021/10/5-pics-acrylic-print-min-500x500.jpg",
        },
        {
            title: "8 Collage Portrait Acrylic Wall Photo",
            description: "Stunning 8-photo portrait acrylic collage for walls.",
            path: "/collage/8-pics",
            image: "https://s.omgs.in/wp-content/uploads/2021/10/8-Collage-Portrait-Acrylic-Wall-Photo-min-500x500.jpg",
        },
        {
            title: "2 Photo Collage Acrylic Wall Photo",
            description: "A sleek 2-photo acrylic collage for modern decor.",
            path: "/collage/2-pics",
            image: "https://s.omgs.in/wp-content/uploads/2021/10/2-Photo-Collage-Acrylic-min-500x500.jpg",
        },
    ],
    "Wall Clocks": [
        {
            title: "Acrylic Wall Clock",
            description: "Stylish acrylic wall clocks for your home decor.",
            path: "/acrylic-wall-clock",
            image: "assets/04 FRAM.jpg",
        },
    ],
};

export const mainDescription = {
    "Acrylic Photos": "Transform your cherished memories into stunning, vibrant art with our premium Acrylic Photos. Experience unparalleled depth and clarity as your images are meticulously printed onto high-gloss acrylic, creating a captivating, gallery-quality display. The sleek, frameless design offers a modern, sophisticated aesthetic, seamlessly enhancing any décor. Unlike traditional prints, acrylic provides exceptional durability and UV protection, ensuring your photos remain vibrant for years to come. Elevate your space with a personalized masterpiece; order your Acrylic Photo today and witness your memories come to life.",
    "Fridge Magnets": "Brighten your kitchen and personalize your space with our vibrant Fridge Magnets! These aren't just magnets; they're miniature canvases for your memories, artwork, or witty messages. Crafted with durable, high-quality materials, they firmly hold notes and photos while adding a splash of personality. Perfect for gifting or personalizing, these magnets are a fun, practical way to express yourself. Start your collection today and make your fridge a gallery!",
    "Acrylic Collages": "Capture your life's moments in a breathtaking Acrylic Collage. We meticulously arrange your chosen photos, then fuse them onto a brilliant, high-gloss acrylic surface, creating a stunning, modern masterpiece. Experience unparalleled depth and vibrancy, transforming your memories into a captivating visual story. Durable, UV-protected, and frameless, it's the perfect statement piece for any home. Design your unique Acrylic Collage today and cherish your memories forever!",
    "Wall Clocks": "Elevate your home's aesthetic with our exquisite Wall Clocks. More than timekeepers, these are statement pieces, blending functionality with artistic design. Crafted with precision, each clock features silent, quartz movement for peaceful accuracy. From minimalist modern to classic vintage, our diverse range complements any décor. Durable materials and vibrant finishes ensure lasting beauty. Transform your walls into a focal point; discover your perfect Wall Clock today and add timeless elegance to your space.",
}

//Favourites
export const cards = [
    {
        title: "Acrylic Photo",
        description: "Discover premium acrylic photo products for decor.",
        path: "/acrylic",
        image: "/assets/02 FRAM.jpg",
    },
    {
        title: "Acrylic Photo",
        description: "Discover premium acrylic photo products for decor.",
        path: "/acrylic",
        image: "/assets/01 FRAM.jpg",
    },
    {
        title: "Clear Acrylic Photo",
        description: "Get high-quality transparent acrylic photo frames.",
        path: "/clear-acrylic",
        image: "assets/03 FRAM.jpg",
    },
    {
        title: "Clear Acrylic Photo",
        description: "Get high-quality transparent acrylic photo frames.",
        path: "/clear-acrylic",
        image: "assets/12 FRAM.jpg",
    },
    {
        title: "Acrylic Fridge Magnets",
        description: "Personalized fridge magnets with unique designs.",
        path: "/fridge-magnets",
        image: "https://s.omgs.in/wp-content/uploads/2023/10/3-800x800.jpg",
    },
    {
        title: "Acrylic Wall Clock",
        description: "Stylish acrylic wall clocks for your home decor.",
        path: "/acrylic-wall-clock",
        image: "assets/04 FRAM.jpg",
    },
    {
        title: "Acrylic Wall Clock",
        description: "Stylish acrylic wall clocks for your home decor.",
        path: "/acrylic-wall-clock",
        image: "assets/05 FRAM.jpg",
    },
    {
        title: "Round Corners Fridge Magnets",
        image: "assets/07 FRAM.jpg",
        description: "Custom round-corner fridge magnets with vibrant prints.",
        path: "/fridge-magnets/round-corners"
    },
    {
        title: "Round Acrylic Fridge Magnets",
        image: "https://s.omgs.in/wp-content/uploads/2024/01/circle-shape-min-768x768.jpg",
        description: "Beautiful round-shaped acrylic fridge magnets.",
        path: "/fridge-magnets/rounded"
    },
    {
        title: "Leaf Shape Fridge Magnets",
        image: "https://s.omgs.in/wp-content/uploads/2024/01/Leaf-2-shape-min-2048x2048.jpg",
        description: "Unique leaf-shaped acrylic magnets for decoration.",
        path: "/fridge-magnets/leaf"
    },
    {
        title: "Square Fridge Magnets",
        image: "https://s.omgs.in/wp-content/uploads/2024/01/square-shape-min-2048x2048.jpg",
        description: "Elegant square-shaped acrylic fridge magnets.",
        path: "/fridge-magnets/square"
    },
    {
        title: "5 Pics Collage Premium Wall Photo",
        image: "https://s.omgs.in/wp-content/uploads/2021/10/5-pics-acrylic-print-min-500x500.jpg",
        description: "Premium acrylic wall collage with 5 photo slots.",
        path: "/collage/5-pics"
    },
    {
        title: "8 Collage Portrait Acrylic Wall Photo",
        image: "https://s.omgs.in/wp-content/uploads/2021/10/8-Collage-Portrait-Acrylic-Wall-Photo-min-500x500.jpg",
        description: "Stunning 8-photo portrait acrylic collage for walls.",
        path: "/collage/8-pics"
    },
    {
        title: "2 Photo Collage Acrylic Wall Photo",
        image: "https://s.omgs.in/wp-content/uploads/2021/10/2-Photo-Collage-Acrylic-min-500x500.jpg",
        description: "A sleek 2-photo acrylic collage for modern decor.",
        path: "/collage/2-pics"
    }
];

//Ideas
export const ideas = [
    {
        name: "Benefits Of Using Cotton Bags And Pouch Over Plastic Pouch/Bags",
        des: "Cotton tote bags are more than just versatile; there are several benefits of cloth bags. Let us have a look at what is a tote bag and what is a tote bag used for.",
        image: "/assets/washable-tote-bags.jpg",
    },
    {
        name: "10+ Romantic Wedding Couple Poses For 2025",
        des: "You will find the best wedding couple poses for 2025 here whether you need romantic wedding couple poses, fun couple poses or elegant husband-wife photo poses.",
        image: "/assets/wedding-pose-ideas-for-2025.webp",
    },
    {
        name: "How To Create A Photo Journal – Using Photo Prints",
        des: "A Step-by-Step Guide to Creating an Inspiring Photo Journal",
        image: "/assets/steps-to-make-your-photo-journal.jpg",
    },
    {
        name: "10 Money Management Tips To Help Improve Your Finances",
        des: "Managing your money doesn’t have to feel overwhelming. These money management tips will help you improve your financial well-bring in a seamless and strategic way",
        image: "/assets/name-on-finance-journal.jpg",
    },
];

//Reviews
export const reviews = [
    {
        name: "Nikunj Sheladiya",
        review: "Verry good work and experience,also photo quality is better than other's",
        rating: "5",
    },
    {
        name: "Abhay Sakariya",
        review:
            "This uv print are amazing. This two picture of lord hanumanji are from there. It is such nice work . I loved it. It is amazing.the finishing of the print is very good.",
        rating: "5",
    },
    {
        name: "Meet Patel",
        review: "Om uv print quality and work is too 👍 good.",
        rating: "5",
    },
    {
        name: "Sakariya Rajni",
        review: "Best and amazing experience of this print…thnk u om uv print this type of desire work and best work",
        rating: "5",
    },
    {
        name: "Hiren Kansagra",
        review:
            "Great place ever to get best mobile cover",
        rating: "5",
    },
    {
        name: "Dobariya.vimal Babubhai",
        review: "Bast quality and good service",
        rating: "5",
    },
];

//Shop By
export const shop = [
    {
        name: "Karwa Chauth",
        des: "Celebrate New Beginnings with a Personalized Baby Arrival Gift.",
        image: "/assets/12 X 18 - BABY BORN.jpg",
    },
    {
        name: "Farewell",
        des: "Capture Every Moment of Love with a Personalized Story Timeline",
        image: "/assets/12 X 18 - OUR LOVE STORY.jpg",
    },
    {
        name: "Fathers Day",
        des: "Honor Dad with a Personalized Fathers Day Gift.",
        image: "/assets/fathers-day.webp",
    },
    {
        name: "Friendship Day",
        des: "Celebrate Bonds with a Personalized Friendship Gift.",
        image: "/assets/friendships-day.jpg",
    },
];

//Trend
export const trendPhoto = [
    {
        image: "/assets/image_0 (1).webp",
        tag: "/assets/post.svg",
    },
    {
        image: "/assets/5.5-customized-softcover-photobook.webp",
        tag: "/assets/camera.svg",
    },
    {
        image: "/assets/image_0 (4).webp",
        tag: "/assets/post.svg",
    },
    {
        image: "/assets/image_0 (5).webp",
        tag: "/assets/camera.svg",
    },
    {
        image: "/assets/image_0.webp",
        tag: "/assets/post.svg",
    },
];
