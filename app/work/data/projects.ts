const HUGGINGFACE_URL = process.env.NEXT_PUBLIC_HUGGINGFACE_URL

export interface Project {
    id: string;
    slug: string;
    name: string;
    location: string;
    date: string;
    description: string;
    modelFile: string;
    modelUrl: string;
    thumbnail: string;
    category: 'construction' | 'heritage' | 'landscape' | 'infrastructure' | 'object';
    stats: {
        images: string;
        points: string;
        area: string;
        accuracy: string;
    }
}

function buildModelUrl(filename: string): string {
    return `${HUGGINGFACE_URL}/${filename}`;
}

export const projects: Project[] = [
    {
        id: 'temple',
        slug: 'temple',
        name: 'Temple 2DGS',
        location: 'Heritage Site',
        date: '2024',
        description: 'High-fidelity 3D reconstruction of a heritage temple site using 2D Gaussian Splatting technology.',
        modelFile: 'temple_2dgs.ply',
        modelUrl: buildModelUrl('temple_2dgs.ply'),
        thumbnail: '/assets/temple-tn.png',
        category: 'heritage',
        stats: {
            images: '300+',
            points: '2.1M',
            area: '800 m²',
            accuracy: '±2cm'
        }
    },
    {
        id: 'red-rocks',
        slug: 'red-rocks',
        name: 'Red Rocks',
        location: 'Natural Landscape',
        date: '2024',
        description: 'Detailed 3D scan of a stunning red rock formation showcasing natural geological features.',
        modelFile: 'red_rocks_cleaned.ply',
        modelUrl: buildModelUrl('red_rocks_cleaned.ply'),
        thumbnail: '/assets/rocks-tn.png',
        category: 'landscape',
        stats: {
            images: '450+',
            points: '3.2M',
            area: '1200 m²',
            accuracy: '±3cm'
        }
    },
    {
        id: 'flower-pot',
        slug: 'flower-pot',
        name: 'Flower Pot',
        location: 'Object Scan',
        date: '2024',
        description: 'Precision 3D capture of a decorative flower pot demonstrating close-range scanning capabilities.',
        modelFile: 'flower-pot.ply',
        modelUrl: buildModelUrl('flower-pot.ply'),
        thumbnail: '/assets/flowerpot-tn.png',
        category: 'object',
        stats: {
            images: '120+',
            points: '800K',
            area: '1 m²',
            accuracy: '±1mm'
        }
    },
];

export function getProjectBySlug(slug: string): Project | undefined {
    return projects.find(p => p.slug === slug);
}

export function getProjectById(id: string): Project | undefined {
    return projects.find(p => p.id === id);
}

export function getAllProjectSlugs(): string[] {
    return projects.map(p => p.slug);
}

export function getProjectsByCategory(category: Project['category']): Project[] {
    return projects.filter(p => p.category === category);
}