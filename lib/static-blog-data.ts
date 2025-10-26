export interface BlogPost {
  _id: string;
  _title: string;
  _slug: string;
  excerpt: string;
  date: string;
  coverImage: {
    url: string;
  };
  author: {
    _title: string;
    avatar: {
      url: string;
    };
  };
}

export const staticBlogData = {
  blog: {
    morePosts: "More Stories",
    posts: {
      items: [
        {
          _id: "1",
          _title: "The Future of Drone Technology",
          _slug: "future-drone-technology",
          excerpt: "Exploring the latest advancements in drone technology and how they're revolutionizing various industries from agriculture to delivery services.",
          date: "2024-01-15",
          coverImage: {
            url: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1500&h=1000&fit=crop&crop=center"
          },
          author: {
            _title: "Dr. Sarah Johnson",
            avatar: {
              url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=96&h=96&fit=crop&crop=face"
            }
          }
        },
        {
          _id: "2",
          _title: "Drone Safety Regulations: What You Need to Know",
          _slug: "drone-safety-regulations",
          excerpt: "A comprehensive guide to understanding drone safety regulations and compliance requirements for commercial and recreational use.",
          date: "2024-01-10",
          coverImage: {
            url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1500&h=1000&fit=crop&crop=center"
          },
          author: {
            _title: "Mike Chen",
            avatar: {
              url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face"
            }
          }
        },
        {
          _id: "3",
          _title: "Agricultural Drones: Transforming Farming",
          _slug: "agricultural-drones-farming",
          excerpt: "How agricultural drones are helping farmers increase crop yields, monitor plant health, and optimize resource usage.",
          date: "2024-01-05",
          coverImage: {
            url: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1500&h=1000&fit=crop&crop=center"
          },
          author: {
            _title: "Dr. Emily Rodriguez",
            avatar: {
              url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face"
            }
          }
        },
        {
          _id: "4",
          _title: "Drone Photography: Capturing the World from Above",
          _slug: "drone-photography-tips",
          excerpt: "Essential tips and techniques for capturing stunning aerial photographs using drones, from composition to post-processing.",
          date: "2024-01-01",
          coverImage: {
            url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1500&h=1000&fit=crop&crop=center"
          },
          author: {
            _title: "Alex Thompson",
            avatar: {
              url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face"
            }
          }
        }
      ]
    }
  }
};
