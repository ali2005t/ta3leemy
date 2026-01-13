import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.5rem 5%',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--border)'
        }}>
            <Link to="/" className="logo" style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'var(--text-light)',
                textDecoration: 'none'
            }}>🚀 تعليمي</Link>

            <div className="nav-links" style={{ display: 'flex', gap: '20px' }}>
                <Link to="/" className="active" style={{ color: 'var(--primary)', textDecoration: 'none' }}>الرئيسية</Link>
                <Link to="/tutorial" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>شرح المنصة</Link>
                <a href="#download" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>تحميل</a>
            </div>
        </nav>
    );
};

export default Navbar;
