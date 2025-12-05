// Enhanced product data with detailed information
const products = [
    // Beauty Products
    {
        id: 1,
        name: "Mignonne™ Hydrating Face Serum",
        category: "beauty",
        price: 49.99,
        wholesalePrice: 34.99,
        description: "Intensive hydration serum with hyaluronic acid",
        icon: "fa-tint",
        rating: 4.8,
        reviewCount: 234,
        itemCode: "MIG-HS-001",
        availability: "in-stock",
        stockCount: 45,
        detailedDescription: "Transform your skin with our advanced hydrating face serum. This lightweight, fast-absorbing formula penetrates deep into the skin layers to provide long-lasting moisture and improve skin texture. Clinically tested and dermatologist approved for all skin types.",
        benefits: [
            "Deep hydration for up to 24 hours",
            "Reduces fine lines and wrinkles", 
            "Improves skin elasticity",
            "Non-comedogenic formula",
            "Suitable for all skin types"
        ],
        ingredients: [
            "Hyaluronic Acid (2%)",
            "Vitamin E",
            "Glycerin",
            "Niacinamide", 
            "Panthenol (Pro-Vitamin B5)",
            "Sodium Hyaluronate",
            "Aqua (Water)",
            "Phenoxyethanol"
        ],
        usage: {
            frequency: "Apply twice daily",
            instructions: "Cleanse your face thoroughly. Apply 2-3 drops to clean, dry skin. Gently massage in upward motions until fully absorbed. Follow with moisturizer and sunscreen during the day.",
            tips: [
                "Use on damp skin for better absorption",
                "Can be layered under makeup", 
                "Store in a cool, dry place",
                "Avoid direct contact with eyes"
            ]
        },
        specifications: {
            volume: "30ml",
            shelf_life: "24 months unopened, 12 months after opening",
            origin: "Made in USA",
            cruelty_free: true,
            vegan: true
        }
    },
    {
        id: 2,
        name: "Mignonne™ Anti-Aging Night Cream",
        category: "beauty",
        price: 59.99,
        wholesalePrice: 41.99,
        description: "Rich night cream with retinol and peptides",
        icon: "fa-moon",
        rating: 4.6,
        reviewCount: 189,
        itemCode: "MIG-NC-002",
        availability: "in-stock",
        stockCount: 28,
        detailedDescription: "Rejuvenate your skin overnight with our premium anti-aging night cream. This luxurious formula combines powerful retinol with peptides to target signs of aging while you sleep. Wake up to visibly smoother, firmer, and more youthful-looking skin.",
        benefits: [
            "Reduces appearance of fine lines",
            "Firms and tightens skin",
            "Improves skin texture",
            "Promotes cellular renewal",
            "Deeply moisturizes overnight"
        ],
        ingredients: [
            "Retinol (0.5%)",
            "Peptide Complex",
            "Shea Butter",
            "Ceramides",
            "Squalane",
            "Vitamin E",
            "Jojoba Oil",
            "Dimethicone"
        ],
        usage: {
            frequency: "Apply every evening",
            instructions: "Cleanse face thoroughly. Apply a small amount to face and neck, avoiding eye area. Gently massage until absorbed. Start with 2-3 times per week, gradually increase to nightly use as tolerated.",
            tips: [
                "Always use sunscreen during the day when using retinol",
                "May cause initial dryness - reduce frequency if irritation occurs",
                "Not recommended during pregnancy",
                "Patch test before first use"
            ]
        },
        specifications: {
            volume: "50ml",
            shelf_life: "36 months unopened, 12 months after opening",
            origin: "Made in France",
            cruelty_free: true,
            vegan: false
        }
    },
    {
        id: 3,
        name: "Mignonne™ Vitamin C Brightening Mask",
        category: "beauty",
        price: 39.99,
        wholesalePrice: 27.99,
        description: "Illuminating face mask with vitamin C",
        icon: "fa-star",
        rating: 4.7,
        reviewCount: 156,
        itemCode: "MIG-VM-003",
        availability: "low-stock",
        stockCount: 8,
        detailedDescription: "Revitalize and brighten your complexion with our Vitamin C Brightening Mask. This powerful treatment mask is formulated with stable vitamin C and natural brightening agents to even out skin tone and restore radiance in just 15 minutes.",
        benefits: [
            "Brightens and evens skin tone",
            "Reduces dark spots and hyperpigmentation",
            "Boosts collagen production", 
            "Antioxidant protection",
            "Instant glow and radiance"
        ],
        ingredients: [
            "L-Ascorbic Acid (15%)",
            "Kojic Acid",
            "Niacinamide",
            "Alpha Arbutin",
            "Licorice Root Extract",
            "Kaolin Clay",
            "Glycolic Acid",
            "Aloe Vera Extract"
        ],
        usage: {
            frequency: "Use 2-3 times per week",
            instructions: "Apply a thick, even layer to clean, dry skin. Avoid eye and lip areas. Leave on for 10-15 minutes. Rinse thoroughly with lukewarm water. Follow with moisturizer and sunscreen.",
            tips: [
                "Use in the evening for best results",
                "May cause tingling sensation - this is normal",
                "Always follow with SPF protection",
                "Discontinue use if irritation occurs"
            ]
        },
        specifications: {
            volume: "75ml", 
            shelf_life: "24 months unopened, 6 months after opening",
            origin: "Made in Korea",
            cruelty_free: true,
            vegan: true
        }
    },
    {
        id: 4,
        name: "Mignonne™ Natural Lip Gloss Set",
        category: "beauty",
        price: 29.99,
        wholesalePrice: 20.99,
        description: "Set of 3 nourishing lip glosses",
        icon: "fa-kiss",
        rating: 4.5,
        reviewCount: 98,
        itemCode: "MIG-LG-004",
        availability: "out-of-stock",
        stockCount: 0
    },
    {
        id: 5,
        name: "Mignonne™ Matte Foundation",
        category: "beauty",
        price: 44.99,
        wholesalePrice: 31.49,
        description: "Long-lasting matte finish foundation",
        icon: "fa-palette",
        rating: 4.4,
        reviewCount: 167,
        itemCode: "MIG-MF-005",
        availability: "in-stock",
        stockCount: 32
    },
    {
        id: 6,
        name: "Mignonne™ Eye Shadow Palette",
        category: "beauty",
        price: 54.99,
        wholesalePrice: 38.49,
        description: "12 colors professional eye shadow palette",
        icon: "fa-eye",
        rating: 4.9,
        reviewCount: 312,
        itemCode: "MIG-EP-006",
        availability: "discontinued",
        stockCount: 0
    },

    // Vitamins & Supplements
    {
        id: 7,
        name: "Nature™ Multivitamin Complex",
        category: "vitamins",
        price: 34.99,
        wholesalePrice: 24.49,
        description: "Daily multivitamin with essential nutrients",
        icon: "fa-capsules",
        rating: 4.6,
        reviewCount: 287,
        itemCode: "NAT-MV-007",
        availability: "in-stock",
        stockCount: 67,
        detailedDescription: "Support your overall health and wellness with our comprehensive multivitamin complex. This carefully formulated supplement provides essential vitamins and minerals that your body needs daily. Perfect for busy lifestyles and ensuring nutritional gaps are filled.",
        benefits: [
            "Supports immune system function",
            "Boosts energy levels and reduces fatigue",
            "Promotes healthy metabolism",
            "Supports bone and muscle health",
            "Enhances cognitive function and focus"
        ],
        ingredients: [
            "Vitamin A (as Beta-Carotene) 5000 IU",
            "Vitamin C (as Ascorbic Acid) 90mg",
            "Vitamin D3 (as Cholecalciferol) 2000 IU",
            "Vitamin E (as d-alpha-tocopherol) 30 IU",
            "Vitamin K2 (as Menaquinone-7) 120mcg",
            "Thiamine (B1) 1.5mg",
            "Riboflavin (B2) 1.7mg",
            "Niacin (B3) 20mg",
            "Vitamin B6 (as Pyridoxine HCl) 2mg",
            "Folate (as 5-MTHF) 400mcg",
            "Vitamin B12 (as Methylcobalamin) 6mcg",
            "Biotin 300mcg",
            "Pantothenic Acid (B5) 10mg",
            "Iron (as Ferrous Bisglycinate) 8mg",
            "Zinc (as Zinc Bisglycinate) 11mg",
            "Selenium (as Selenomethionine) 70mcg",
            "Copper (as Copper Bisglycinate) 0.9mg",
            "Manganese (as Manganese Bisglycinate) 2.3mg",
            "Chromium (as Chromium Picolinate) 120mcg",
            "Molybdenum (as Sodium Molybdate) 45mcg"
        ],
        usage: {
            frequency: "Take 1 capsule daily",
            instructions: "Take 1 capsule daily with food, preferably with breakfast or your largest meal of the day. Swallow whole with a full glass of water. For optimal absorption, do not take with coffee, tea, or dairy products.",
            tips: [
                "Take consistently at the same time each day",
                "Best absorbed when taken with a meal containing healthy fats",
                "Store in a cool, dry place away from direct sunlight",
                "Do not exceed recommended dosage",
                "Consult your healthcare provider before starting any supplement regimen"
            ]
        },
        specifications: {
            serving_size: "1 capsule",
            servings_per_container: "60",
            capsule_type: "Vegetarian capsules",
            shelf_life: "36 months from manufacture date",
            origin: "Made in USA",
            third_party_tested: true,
            gmp_certified: true,
            non_gmo: true,
            gluten_free: true,
            dairy_free: true,
            soy_free: true
        }
    },
    {
        id: 8,
        name: "Nature™ Omega-3 Fish Oil",
        category: "vitamins",
        price: 29.99,
        wholesalePrice: 20.99,
        description: "Premium omega-3 fatty acids supplement",
        icon: "fa-fish",
        rating: 4.7,
        reviewCount: 198,
        itemCode: "NAT-FO-008",
        availability: "in-stock",
        stockCount: 89,
        detailedDescription: "Support your cardiovascular and brain health with our premium omega-3 fish oil supplement. Sourced from wild-caught, sustainable fish and molecularly distilled for purity. Each softgel delivers optimal amounts of EPA and DHA for maximum health benefits.",
        benefits: [
            "Supports heart and cardiovascular health",
            "Promotes brain function and memory",
            "Reduces inflammation throughout the body",
            "Supports healthy cholesterol levels",
            "Promotes joint health and mobility",
            "Supports healthy skin and hair"
        ],
        ingredients: [
            "Fish Oil Concentrate 1000mg",
            "EPA (Eicosapentaenoic Acid) 180mg",
            "DHA (Docosahexaenoic acid) 120mg",
            "Other Omega-3 Fatty Acids 100mg",
            "Natural Vitamin E (as mixed tocopherols)",
            "Gelatin (softgel capsule)",
            "Glycerin",
            "Purified Water"
        ],
        usage: {
            frequency: "Take 1-2 softgels daily",
            instructions: "Take 1-2 softgels daily with meals. For best results, take with a meal containing fat to enhance absorption. Can be taken with breakfast, lunch, or dinner. Do not chew or break the softgel.",
            tips: [
                "Store in refrigerator after opening for maximum freshness",
                "Take with meals to reduce any fishy aftertaste",
                "Consistent daily use provides best results",
                "If you have a fish allergy, consult your doctor before use",
                "May take 2-3 months of consistent use to see full benefits"
            ]
        },
        specifications: {
            serving_size: "1 softgel",
            servings_per_container: "120",
            total_omega_3: "400mg per softgel",
            fish_source: "Wild-caught Anchovies, Sardines, Mackerel",
            purity: "Molecularly distilled",
            shelf_life: "24 months from manufacture date",
            origin: "Made in USA",
            third_party_tested: true,
            mercury_tested: true,
            sustainable_sourced: true,
            enteric_coated: false
        }
    },
    {
        id: 9,
        name: "Nature™ Vitamin D3 + K2",
        category: "vitamins",
        price: 24.99,
        wholesalePrice: 17.49,
        description: "Bone health support formula",
        icon: "fa-bone",
        rating: 4.5,
        reviewCount: 143,
        itemCode: "NAT-VD-009",
        availability: "low-stock",
        stockCount: 12
    },
    {
        id: 10,
        name: "Nature™ Probiotic Complex",
        category: "vitamins",
        price: 39.99,
        wholesalePrice: 27.99,
        description: "Digestive health probiotic blend",
        icon: "fa-heartbeat",
        rating: 4.8,
        reviewCount: 201,
        itemCode: "NAT-PC-010",
        availability: "in-stock",
        stockCount: 54
    },
    {
        id: 11,
        name: "Nature™ Collagen Peptides",
        category: "vitamins",
        price: 44.99,
        wholesalePrice: 31.49,
        description: "Skin, hair, and nail support",
        icon: "fa-hand-sparkles",
        rating: 4.6,
        reviewCount: 176,
        itemCode: "NAT-CP-011",
        availability: "pre-order",
        stockCount: 0
    },
    {
        id: 12,
        name: "Nature™ B-Complex Vitamins",
        category: "vitamins",
        price: 19.99,
        wholesalePrice: 13.99,
        description: "Energy and metabolism support",
        icon: "fa-bolt",
        rating: 4.3,
        reviewCount: 134,
        itemCode: "NAT-BC-012",
        availability: "in-stock",
        stockCount: 78
    },

    // Personal Care
    {
        id: 13,
        name: "Organic Body Lotion",
        category: "personal",
        price: 24.99,
        wholesalePrice: 17.49,
        description: "Nourishing body lotion with shea butter",
        icon: "fa-pump-soap"
    },
    {
        id: 14,
        name: "Charcoal Detox Soap",
        category: "personal",
        price: 14.99,
        wholesalePrice: 10.49,
        description: "Deep cleansing activated charcoal soap",
        icon: "fa-soap"
    },
    {
        id: 15,
        name: "Herbal Shampoo & Conditioner",
        category: "personal",
        price: 32.99,
        wholesalePrice: 23.09,
        description: "Natural hair care duo set",
        icon: "fa-shower"
    },
    {
        id: 16,
        name: "Deodorant Cream",
        category: "personal",
        price: 18.99,
        wholesalePrice: 13.29,
        description: "Natural aluminum-free deodorant",
        icon: "fa-spray-can"
    },
    {
        id: 17,
        name: "Hand Cream Set",
        category: "personal",
        price: 26.99,
        wholesalePrice: 18.89,
        description: "Moisturizing hand cream trio",
        icon: "fa-hands"
    },
    {
        id: 18,
        name: "Body Scrub",
        category: "personal",
        price: 22.99,
        wholesalePrice: 16.09,
        description: "Exfoliating sugar body scrub",
        icon: "fa-hand-sparkles"
    },

    // Home Care
    {
        id: 19,
        name: "All-Purpose Cleaner",
        category: "home",
        price: 16.99,
        wholesalePrice: 11.89,
        description: "Natural multi-surface cleaner",
        icon: "fa-spray-can"
    },
    {
        id: 20,
        name: "Laundry Detergent",
        category: "home",
        price: 21.99,
        wholesalePrice: 15.39,
        description: "Eco-friendly laundry detergent pods",
        icon: "fa-tshirt"
    },
    {
        id: 21,
        name: "Dish Soap",
        category: "home",
        price: 12.99,
        wholesalePrice: 9.09,
        description: "Plant-based dish washing liquid",
        icon: "fa-utensils"
    },
    {
        id: 22,
        name: "Glass Cleaner",
        category: "home",
        price: 14.99,
        wholesalePrice: 10.49,
        description: "Streak-free glass cleaner",
        icon: "fa-window-maximize"
    },
    {
        id: 23,
        name: "Floor Cleaner",
        category: "home",
        price: 18.99,
        wholesalePrice: 13.29,
        description: "Wood and tile floor cleaning solution",
        icon: "fa-broom"
    },
    {
        id: 24,
        name: "Air Freshener Set",
        category: "home",
        price: 19.99,
        wholesalePrice: 13.99,
        description: "Natural essential oil air fresheners",
        icon: "fa-wind"
    }
];

// Export products for use in main script
window.productsData = products;
