// ضع هنا بيانات Supabase الخاصة بك التي نسختها سابقاً
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

let currentType = 'quote';

async function fetchPosts(type) {
    const container = document.getElementById('content-container');
    container.innerHTML = '<p class="loading">جاري التحميل...</p>';

    try {
        // جلب البيانات مع ترتيبها من الأحدث للأقدم
        const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?type=eq.${type}&order=created_at.desc`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        const posts = await response.json();
        displayPosts(posts);
    } catch (error) {
        container.innerHTML = '<p class="loading">❌ فشل في تحميل البيانات.</p>';
        console.error(error);
    }
}

function displayPosts(posts) {
    const container = document.getElementById('content-container');
    container.innerHTML = ''; 

    if (posts.length === 0) {
        container.innerHTML = '<p class="loading">لا توجد منشورات في هذا القسم بعد.</p>';
        return;
    }
    
    posts.forEach(post => {
        const card = `
            <div class="card">
                <p class="post-text">"${post.content}"</p>
                <span class="post-date">${new Date(post.created_at).toLocaleDateString('ar-EG')}</span>
            </div>
        `;
        container.innerHTML += card;
    });
}

// دالة التنقل بين الأقسام (اقتباسات، حكم، كتب)
function switchTab(type) {
    currentType = type;
    
    // تغيير شكل الزر النشط
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    fetchPosts(type);
}

// تشغيل جلب الاقتباسات تلقائياً عند فتح الموقع لأول مرة
fetchPosts('quote');
