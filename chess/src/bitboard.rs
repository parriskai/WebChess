use std::ops::{BitAnd, BitOr, BitXor, Not};
use crate::coord::Cord;

pub struct Bitboard(pub u64);

impl Bitboard {
    pub fn get<T: Into<Cord>>(&self, index: T) -> bool{
        let index = index.into();
        (self.0 & (1 << index.inner())) != 0
    }
    pub fn set<T: Into<Cord>>(&mut self, index: T){
        let index = index.into();
        self.0 |= 1 << index.inner();
    }
    pub fn clear<T: Into<Cord>>(&mut self, index: T){
        let index = index.into();
        self.0 &= !(1 << index.inner());
    }
    pub fn toggle<T: Into<Cord>>(&mut self, index: T){
        let index = index.into();
        self.0 ^= 1 << index.inner();
    }
}

impl<T: Into<Bitboard>> BitAnd<T> for Bitboard{
    type Output = Bitboard;

    fn bitand(self, rhs: T) -> Self::Output {
        let rhs = rhs.into();
        Bitboard(self.0 & rhs.0)
    }
}

impl<T: Into<Bitboard>> BitOr<T> for Bitboard{
    type Output = Bitboard;

    fn bitor(self, rhs: T) -> Self::Output {
        let rhs = rhs.into();
        Bitboard(self.0 | rhs.0)
    }
}

impl<T: Into<Bitboard>> BitXor<T> for Bitboard{
    type Output = Bitboard;

    fn bitxor(self, rhs: T) -> Self::Output {
        let rhs = rhs.into();
        Bitboard(self.0 | rhs.0)
    }
}

impl Not for Bitboard {
    type Output = Bitboard;

    fn not(self) -> Self::Output {
        Bitboard(!self.0)
    }
}