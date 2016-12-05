export default {
    user: {
        bio: { access: ['public'] },
        cover: { access: ['public'] },
        created_at: { access: ['user.id=resource.id', 'user.role="admin"'] },
        created_by: { access: ['user.role="admin"'] },
        id: { access: ['public'] },
        image: { access: ['public'] },
        language: { access: ['public'] },
        last_login: { access: ['user.id=resource.id', 'user.role="admin"'] },
        location: { access: ['public'] },
        username: { access: ['public'] },
        email: { access: ['public'] },
        slug: { access: ['public'] },
        status: { access: ['user.id=resource.id', 'user.role="admin"'] },
        updated_at: { access: ['user.role="admin"'] },
        updated_by: { access: ['user.role="admin"'] },
        website: { access: ['public'] },
    },
    category: {
        id: { access: ['public'] },
        name: { access: ['public'] },
        slug: { access: ['public'] },
        image: { access: ['public'] },
        created_at: { access: ['user.role="admin"'] },
        created_by: { access: ['user.role="admin"'] },
        updated_by: { access: ['user.role="admin"'] },
        updated_at: { access: ['user.role="admin"'] },
    },
    post: {
        id: { access: ['public'] },
        title: { access: ['public'] },
        slug: { access: ['public'] },
        html: { access: ['public'] },
        image: { access: ['public'] },
        featured: { access: ['public'] },
        status: { access: ['user.id=resource.author', 'user.role="admin"'] },
        author: { access: ['public'], related_data: true },
        created_by: { access: ['user.id=resource.author', 'user.role="admin"'] },
        created_at: { access: ['user.id=resource.author', 'user.role="admin"'] },
        updated_at: { access: ['user.id=resource.author', 'user.role="admin"'] },
        updated_by: { access: ['user.id=resource.author', 'user.role="admin"'] },
        category: { access: ['public'], related_data: true },
        url: { access: ['public'] },
    },
};
